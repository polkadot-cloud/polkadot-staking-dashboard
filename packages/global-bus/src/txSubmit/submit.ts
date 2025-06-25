// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SubmittableExtrinsic } from 'dedot'
import type { ExtrinsicSignatureV4 } from 'dedot/codecs'
import type { InjectedSigner, TxStatus } from 'dedot/types'
import type { TxStatusHandlers } from 'types'
import { deleteTx, setUidPending, setUidSubmitted, subs } from './index'

export const addSignAndSend = async (
  uid: number,
  from: string,
  tx: SubmittableExtrinsic,
  signer: InjectedSigner,
  nonce: number,
  txStatusHandlers: TxStatusHandlers
) => {
  const { onError, ...onRest } = txStatusHandlers
  try {
    subs[uid] = await tx.signAndSend(
      from,
      { signer, nonce },
      async ({ status }) => {
        handleResult(uid, status, onRest)
      }
    )
  } catch (e) {
    handleError(String(e), onError)
    deleteTx(uid)
  }
}

export const addSend = async (
  uid: number,
  tx: SubmittableExtrinsic,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signature: ExtrinsicSignatureV4<any, any, any>,
  { onError, ...onRest }: TxStatusHandlers
) => {
  tx.attachSignature(signature)
  try {
    subs[uid] = await tx.send(async ({ status }) => {
      handleResult(uid, status, onRest)
    })
  } catch (e) {
    handleError(String(e), onError)
    deleteTx(uid)
  }
}

export const handleResult = (
  uid: number,
  status: TxStatus,
  {
    onReady,
    onInBlock,
    onFinalized,
    onFailed,
  }: {
    onReady: () => void
    onInBlock: () => void
    onFinalized: () => void
    onFailed: (err: Error) => void
  }
) => {
  if (status.type === 'Broadcasting') {
    setUidPending(uid, true)
    onReady()
  }
  if (status.type === 'BestChainBlockIncluded') {
    onInBlock()
    setUidSubmitted(uid, false)
    setUidPending(uid, false)
  }
  if (status.type === 'Finalized') {
    onFinalized()
    deleteTx(uid)
  }
  if (status.type === 'Invalid') {
    onFailed(Error('Invalid transaction'))
    deleteTx(uid)
  }
}

export const handleError = (
  errorMessage: string,
  onError: (type?: string, details?: string) => void
) => {
  const msgLower = errorMessage.toLowerCase()

  if (
    /user rejected|cancel(l)?ed|cancel(l)?ed by user|usercancel/.test(msgLower)
  ) {
    onError('user_cancelled')
  } else if (
    /insufficient|balance|insufficientbalance|not enough/.test(msgLower)
  ) {
    onError('insufficient_funds')
  } else {
    // Enhanced technical error classification
    const technicalDetails = classifyTechnicalError(errorMessage)
    onError('technical', technicalDetails)
  }
}

// Enhanced technical error classification
const classifyTechnicalError = (errorMessage: string): string => {
  const msgLower = errorMessage.toLowerCase()
  
  // Signer-related errors
  if (/signer|signature|signing/.test(msgLower)) {
    if (/missing|not found|undefined/.test(msgLower)) {
      return 'missing_signer'
    }
    if (/invalid|failed|error/.test(msgLower)) {
      return 'invalid_signer'
    }
    if (/timeout|timed out/.test(msgLower)) {
      return 'signer_timeout'
    }
    return 'signer_error'
  }
  
  // Network connectivity errors
  if (/network|connection|connectivity/.test(msgLower)) {
    if (/timeout|timed out/.test(msgLower)) {
      return 'network_timeout'
    }
    if (/disconnected|offline/.test(msgLower)) {
      return 'network_disconnected'
    }
    if (/unreachable|failed to connect/.test(msgLower)) {
      return 'network_unreachable'
    }
    return 'network_error'
  }
  
  // Transaction parameter errors
  if (/parameter|argument|invalid/.test(msgLower)) {
    if (/nonce|sequence/.test(msgLower)) {
      return 'invalid_nonce'
    }
    if (/fee|payment/.test(msgLower)) {
      return 'invalid_fee'
    }
    if (/call|method/.test(msgLower)) {
      return 'invalid_call'
    }
    return 'invalid_parameters'
  }
  
  // Hardware wallet specific errors
  if (/ledger|hardware|device/.test(msgLower)) {
    if (/locked|unlock/.test(msgLower)) {
      return 'device_locked'
    }
    if (/busy|in use/.test(msgLower)) {
      return 'device_busy'
    }
    if (/not connected|disconnected/.test(msgLower)) {
      return 'device_disconnected'
    }
    if (/app not open|open app/.test(msgLower)) {
      return 'app_not_open'
    }
    return 'hardware_error'
  }
  
  // Wallet Connect errors
  if (/wallet.?connect|wc/.test(msgLower)) {
    if (/session|disconnected/.test(msgLower)) {
      return 'wc_session_disconnected'
    }
    if (/timeout|timed out/.test(msgLower)) {
      return 'wc_timeout'
    }
    return 'wallet_connect_error'
  }
  
  // Vault/QR code errors
  if (/vault|qr|qrcode/.test(msgLower)) {
    if (/scan|read/.test(msgLower)) {
      return 'qr_scan_error'
    }
    if (/invalid|failed/.test(msgLower)) {
      return 'qr_invalid'
    }
    return 'vault_error'
  }
  
  // Runtime/version errors
  if (/runtime|version|metadata/.test(msgLower)) {
    if (/incompatible|mismatch/.test(msgLower)) {
      return 'runtime_incompatible'
    }
    if (/not supported|unsupported/.test(msgLower)) {
      return 'runtime_unsupported'
    }
    return 'runtime_error'
  }
  
  // Pool-specific errors
  if (/pool|nomination.?pool/.test(msgLower)) {
    if (/full|maximum|limit|exceeded/.test(msgLower)) {
      return 'pool_full'
    }
    if (/blocked|blocking/.test(msgLower)) {
      return 'pool_blocked'
    }
    if (/destroying|destroyed/.test(msgLower)) {
      return 'pool_destroying'
    }
    if (/invalid.?state|state/.test(msgLower)) {
      return 'pool_invalid_state'
    }
    if (/invalid.?id|pool.?id/.test(msgLower)) {
      return 'validation_error_invalid_pool_id'
    }
    return 'pool_error'
  }
  
  // Staking-specific errors
  if (/staking|stake|bond/.test(msgLower)) {
    if (/minimum|min.?bond|below/.test(msgLower)) {
      return 'staking_error_min_bond'
    }
    if (/maximum|max.?nominations|16/.test(msgLower)) {
      return 'staking_error_max_nominations'
    }
    if (/era|epoch|session/.test(msgLower)) {
      return 'staking_error_era_constraint'
    }
    return 'staking_error'
  }
  
  // Commission errors
  if (/commission|comission/.test(msgLower)) {
    if (/exceeds|above|maximum|max/.test(msgLower)) {
      if (/global/.test(msgLower)) {
        return 'commission_error_exceeds_global'
      }
      return 'commission_error_exceeds_max'
    }
    if (/change.?rate|rate.?change/.test(msgLower)) {
      return 'commission_error_change_rate'
    }
    if (/payee|recipient/.test(msgLower)) {
      return 'commission_error_invalid_payee'
    }
    return 'commission_error'
  }
  
  // Balance and fee errors
  if (/balance|fee|payment/.test(msgLower)) {
    if (/reserve|locked|freeze/.test(msgLower)) {
      return 'balance_error_locked'
    }
    if (/reserve|minimum/.test(msgLower)) {
      return 'balance_error_reserve_required'
    }
    if (/calculation|compute/.test(msgLower)) {
      return 'balance_error_fee_calculation'
    }
    return 'balance_error'
  }
  
  // Validation errors
  if (/validation|validate|invalid/.test(msgLower)) {
    if (/address|format/.test(msgLower)) {
      return 'validation_error_address_format'
    }
    if (/metadata|length/.test(msgLower)) {
      return 'validation_error_metadata_too_long'
    }
    if (/parameter|range/.test(msgLower)) {
      return 'validation_error_parameter_range'
    }
    if (/validator/.test(msgLower)) {
      return 'validation_error_invalid_validator'
    }
    return 'validation_error'
  }
  
  // Generic technical errors
  if (/timeout|timed out/.test(msgLower)) {
    return 'general_timeout'
  }
  if (/permission|access/.test(msgLower)) {
    return 'permission_denied'
  }
  if (/quota|limit/.test(msgLower)) {
    return 'rate_limited'
  }
  
  return 'unknown_technical'
}
