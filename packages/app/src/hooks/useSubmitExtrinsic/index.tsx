// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useExtensionAccounts, useExtensions } from '@w3ux/react-connect-kit'
import type { HardwareAccount } from '@w3ux/types'
import { DappName, ManualSigners } from 'consts'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { useTxMeta } from 'contexts/TxMeta'
import { useWalletConnect } from 'contexts/WalletConnect'
import { compactU32 } from 'dedot/shape'
import type { InjectedSigner } from 'dedot/types'
import { concatU8a, hexToU8a } from 'dedot/utils'
import {
  addSend,
  addSignAndSend,
  addUid,
  emitNotification,
  getUid,
  pendingTxCount,
  setUidSubmitted,
  updateFee,
} from 'global-bus'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useProxySupported } from 'hooks/useProxySupported'
import { signLedgerPayload } from 'library/Signers/LedgerSigner'
import { VaultSigner } from 'library/Signers/VaultSigner'
import type {
  VaultSignatureResult,
  VaultSignStatus,
} from 'library/Signers/VaultSigner/types'
import { SignPrompt } from 'library/SubmitTx/ManualSign/Vault/SignPrompt'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types'

export const useSubmitExtrinsic = ({
  tx,
  tag,
  from,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const { t } = useTranslation('app')
  const { serviceApi } = useApi()
  const { network } = useNetwork()
  const { signWcTx } = useWalletConnect()
  const { getAccountBalance } = useBalances()
  const { activeProxy } = useActiveAccounts()
  const { extensionsStatus } = useExtensions()
  const { isProxySupported } = useProxySupported()
  const { openPromptWith, closePrompt } = usePrompt()
  const { handleResetLedgerTask } = useLedgerHardware()
  const { getExtensionAccount } = useExtensionAccounts()
  const { getAccount, requiresManualSign } = useImportedAccounts()
  const { getTxSubmission } = useTxMeta()
  const { unit, units } = getStakingChainData(network)
  const {
    balances: { transferableBalance },
  } = useAccountBalances(from)

  // Store the uid for this transaction.
  const [uid, setUid] = useState<number>(0)

  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account. If
  // already wrapped, update `from` address and return

  let proxySupported = false
  if (tx) {
    proxySupported = isProxySupported(tx, from)
    if (tx.call.pallet === 'Proxy' && tx.call.palletCall.name === 'Proxy') {
      if (activeProxy) {
        from = activeProxy.address
      }
    } else {
      if (activeProxy && proxySupported) {
        // Update submit address to active proxy account
        const real = from
        from = activeProxy.address

        // Check not a batch transactions
        if (
          real &&
          !(tx.call.pallet === 'Utility' && tx.call.palletCall.name === 'Batch')
        ) {
          // Not a batch transaction: wrap tx in proxy call. Proxy calls should already be wrapping
          // each tx within the batch via `useBatchCall`
          const proxiedTx = serviceApi.tx.proxy(real, tx)
          if (proxiedTx) {
            tx = proxiedTx
          }
        }
      }
    }
  }

  // Extrinsic submission handler
  const onSubmit = async () => {
    if (!tx || getUid(uid)?.submitted) {
      return
    }
    if (from === null) {
      return
    }
    const account = getAccount(from)
    if (account === null || !shouldSubmit) {
      return
    }

    const { specName, specVersion } = tx.client.runtimeVersion
    const ss58 = serviceApi.spec.ss58(specName)
    const { source } = account
    const isManualSigner = ManualSigners.includes(source)

    // If `activeAccount` is imported from an extension, ensure it is enabled
    if (!isManualSigner) {
      const isInstalled = Object.entries(extensionsStatus).find(
        ([id, status]) => id === source && status === 'connected'
      )
      if (!isInstalled || !window?.injectedWeb3?.[source]) {
        throw new Error(`${t('walletNotFound')}`)
      }
      // NOTE: Summons extension popup if not already connected
      window.injectedWeb3[source].enable(DappName)
    }

    // Pre-submission state update
    setUidSubmitted(uid, true)

    // Handle signed transaction
    let signer: InjectedSigner | undefined
    let encodedSig
    const handlers = {
      onReady,
      onInBlock,
      onFinalized,
      onFailed,
      onError,
    }

    if (requiresManualSign(from)) {
      const networkInfo = {
        decimals: units,
        tokenSymbol: unit,
        specName,
        specVersion,
        ss58,
      }

      const $Signature = serviceApi.codec.$Signature(specName)
      if (!$Signature) {
        onError('technical', 'missing_signer')
        return
      }

      if (source === 'ledger') {
        const metadata = await serviceApi.signer.metadata(specName)
        const result = await signLedgerPayload(
          specName,
          from,
          serviceApi.signer.extraSignedExtension,
          tx,
          metadata || '0x',
          networkInfo,
          (account as HardwareAccount).index
        )
        if (result) {
          encodedSig = {
            address: from,
            signature: $Signature.tryDecode(result.signature),
            extra: result.data,
          }
        }
      }

      if (source === 'vault') {
        const extra = serviceApi.signer.extraSignedExtension(specName, from)
        if (!extra) {
          onError('technical', 'missing_signer')
          return
        }
        await extra.init()
        const rawPayload = extra.toRawPayload(tx.callHex)
        const prefixedPayload = concatU8a(
          compactU32.encode(tx.callLength),
          hexToU8a(rawPayload.data)
        )
        const result = await new VaultSigner({
          openPrompt: (
            onComplete: (
              status: VaultSignStatus,
              result: VaultSignatureResult
            ) => void,
            toSign: Uint8Array
          ) => {
            openPromptWith(
              <SignPrompt
                submitAddress={from}
                onComplete={onComplete}
                toSign={toSign}
              />,
              'sm',
              false
            )
          },
          closePrompt: () => closePrompt(),
          setSubmitting: (val: boolean) => setUidSubmitted(uid, val),
        }).sign(prefixedPayload)

        encodedSig = {
          address: from,
          signature: $Signature.tryDecode(result),
          extra: extra.data,
        }
      }

      if (source === 'wallet_connect') {
        const extra = serviceApi.signer.extraSignedExtension(specName, from)
        if (!extra) {
          onError('technical', 'missing_signer')
          return
        }
        await extra.init()
        const payload = extra.toPayload(tx.callHex)
        const result = (await signWcTx(payload)).signature

        encodedSig = {
          address: from,
          signature: $Signature.tryDecode(result),
          extra: extra.data,
        }
      }
      // Custom signer
      //
      // Submit the transaction with the raw signature
      if (!encodedSig) {
        onError('technical', 'invalid_signer')
        return
      }
      addSend(uid, tx, encodedSig, handlers)
    } else {
      // Extension signer
      //
      // Get the signer for this account and submit the transaction
      signer = getExtensionAccount(from)?.signer as InjectedSigner | undefined
      if (!signer) {
        onError('technical', 'missing_signer')
        return
      }
      addSignAndSend(
        uid,
        from,
        tx,
        signer as InjectedSigner,
        getAccountBalance(from).nonce + pendingTxCount(from),
        handlers
      )
    }
  }

  // Initialise tx submission
  useEffect(() => {
    // Add a new uid for this transaction
    if (uid === 0) {
      const newUid = addUid({ from, tag })
      setUid(newUid)
    }
  }, [])

  const onReady = () => {
    emitNotification({
      title: t('pending'),
      subtitle: t('transactionInitiated'),
    })
    if (callbackSubmit && typeof callbackSubmit === 'function') {
      callbackSubmit()
    }
  }

  const onInBlock = () => {
    emitNotification({
      title: t('inBlock'),
      subtitle: t('transactionInBlock'),
    })
    if (callbackInBlock && typeof callbackInBlock === 'function') {
      callbackInBlock()
    }
  }

  const onFinalized = () => {
    emitNotification({
      title: t('finalized'),
      subtitle: t('transactionSuccessful'),
    })
  }

  const onFailed = (error?: Error) => {
    const title = t('failed')
    let subtitle = t('errorWithTransaction')

    // Enhanced network-level error handling
    if (error) {
      const errorMessage = error.message.toLowerCase()

      // Check for specific network-level error patterns
      if (/invalid|parameter|argument/.test(errorMessage)) {
        if (/nonce|sequence/.test(errorMessage)) {
          subtitle = t('technicalErrorInvalidNonce')
        } else if (/fee|payment/.test(errorMessage)) {
          subtitle = t('technicalErrorInvalidFee')
        } else if (/call|method/.test(errorMessage)) {
          subtitle = t('technicalErrorInvalidCall')
        } else {
          subtitle = t('technicalErrorInvalidCall')
        }
      } else if (/timeout|timed out/.test(errorMessage)) {
        subtitle = t('technicalErrorNetworkTimeout')
      } else if (/disconnected|offline/.test(errorMessage)) {
        subtitle = t('technicalErrorNetworkDisconnected')
      } else if (/unreachable|failed to connect/.test(errorMessage)) {
        subtitle = t('technicalErrorNetworkUnreachable')
      } else if (/permission|access/.test(errorMessage)) {
        subtitle = t('technicalErrorPermissionDenied')
      } else if (/quota|limit/.test(errorMessage)) {
        subtitle = t('technicalErrorRateLimited')
      } else if (/pool|nomination.?pool/.test(errorMessage)) {
        if (/full|maximum|limit|exceeded/.test(errorMessage)) {
          subtitle = t('poolErrorFull')
        } else if (/blocked|blocking/.test(errorMessage)) {
          subtitle = t('poolErrorBlocked')
        } else if (/destroying|destroyed/.test(errorMessage)) {
          subtitle = t('poolErrorDestroying')
        } else if (/invalid.?state|state/.test(errorMessage)) {
          subtitle = t('poolErrorInvalidState')
        } else {
          subtitle = t('poolErrorInvalidState')
        }
      } else if (/staking|stake|bond/.test(errorMessage)) {
        if (/minimum|min.?bond|below/.test(errorMessage)) {
          subtitle = t('stakingErrorMinBond')
        } else if (/maximum|max.?nominations|16/.test(errorMessage)) {
          subtitle = t('stakingErrorMaxNominations')
        } else if (/era|epoch|session/.test(errorMessage)) {
          subtitle = t('stakingErrorEraConstraint')
        } else {
          subtitle = t('stakingErrorMinBond')
        }
      } else if (/commission|comission/.test(errorMessage)) {
        if (/exceeds|above|maximum|max/.test(errorMessage)) {
          if (/global/.test(errorMessage)) {
            subtitle = t('commissionErrorExceedsGlobal')
          } else {
            subtitle = t('commissionErrorExceedsMax')
          }
        } else if (/change.?rate|rate.?change/.test(errorMessage)) {
          subtitle = t('commissionErrorChangeRate')
        } else if (/payee|recipient/.test(errorMessage)) {
          subtitle = t('commissionErrorInvalidPayee')
        } else {
          subtitle = t('commissionErrorExceedsMax')
        }
      } else if (/balance|reserve|locked/.test(errorMessage)) {
        if (/reserve|minimum/.test(errorMessage)) {
          subtitle = t('balanceErrorReserveRequired')
        } else if (/locked|freeze/.test(errorMessage)) {
          subtitle = t('balanceErrorLocked')
        } else if (/calculation|compute/.test(errorMessage)) {
          subtitle = t('balanceErrorFeeCalculation')
        } else {
          subtitle = t('balanceErrorReserveRequired')
        }
      } else if (/validation|validate|invalid/.test(errorMessage)) {
        if (/address|format/.test(errorMessage)) {
          subtitle = t('validationErrorAddressFormat')
        } else if (/metadata|length/.test(errorMessage)) {
          subtitle = t('validationErrorMetadataTooLong')
        } else if (/parameter|range/.test(errorMessage)) {
          subtitle = t('validationErrorParameterRange')
        } else if (/validator/.test(errorMessage)) {
          subtitle = t('validationErrorInvalidValidator')
        } else if (/pool.?id/.test(errorMessage)) {
          subtitle = t('validationErrorInvalidPoolId')
        } else {
          subtitle = t('validationErrorParameterRange')
        }
      }
    }

    emitNotification({
      title,
      subtitle,
    })
  }

  const onError = (type?: string, details?: string) => {
    if (type === 'ledger') {
      handleResetLedgerTask()
    }

    const txFee = getTxSubmission(uid)?.fee || 0n
    const hasInsufficientFunds = transferableBalance < txFee

    let title = t('cancelled')
    let subtitle = t('transactionCancelled')

    if (type === 'insufficient_funds' || hasInsufficientFunds) {
      title = t('insufficientFunds')

      if (tx?.call.pallet === 'Staking') {
        subtitle = t('addMoreDotForStaking', { unit, minAmount: unit })
      } else if (tx?.call.pallet === 'NominationPools') {
        subtitle = t('addMoreDotForPooling', { unit })
      } else {
        subtitle = t('addMoreDotForFees', { unit })
      }
    } else if (type === 'user_cancelled') {
      title = t('userCancelled')
      subtitle = t('userCancelledTransaction')
    } else if (type === 'technical') {
      // Enhanced technical error handling with specific details
      subtitle = getTechnicalErrorMessage(details)
    }

    emitNotification({
      title,
      subtitle,
    })
  }

  // Helper function to get specific technical error messages
  const getTechnicalErrorMessage = (details?: string): string => {
    if (!details) {
      return t('transactionCancelledTechnical')
    }

    // Map error details to specific translation keys
    const errorKeyMap: Record<string, string> = {
      missing_signer: 'technicalErrorMissingSigner',
      invalid_signer: 'technicalErrorMissingSigner',
      signer_timeout: 'technicalErrorGeneralTimeout',
      signer_error: 'technicalErrorMissingSigner',
      network_timeout: 'technicalErrorNetworkTimeout',
      network_disconnected: 'technicalErrorNetworkDisconnected',
      network_unreachable: 'technicalErrorNetworkUnreachable',
      network_error: 'technicalErrorNetworkDisconnected',
      invalid_nonce: 'technicalErrorInvalidNonce',
      invalid_fee: 'technicalErrorInvalidFee',
      invalid_call: 'technicalErrorInvalidCall',
      invalid_parameters: 'technicalErrorInvalidCall',
      device_locked: 'technicalErrorDeviceLocked',
      device_busy: 'technicalErrorDeviceBusy',
      device_disconnected: 'technicalErrorDeviceDisconnected',
      app_not_open: 'technicalErrorAppNotOpen',
      hardware_error: 'technicalErrorDeviceDisconnected',
      wc_session_disconnected: 'technicalErrorWcSessionDisconnected',
      wc_timeout: 'technicalErrorWcTimeout',
      wallet_connect_error: 'technicalErrorWcSessionDisconnected',
      qr_scan_error: 'technicalErrorQrScanError',
      qr_invalid: 'technicalErrorQrInvalid',
      vault_error: 'technicalErrorQrScanError',
      runtime_incompatible: 'technicalErrorRuntimeIncompatible',
      runtime_unsupported: 'technicalErrorRuntimeUnsupported',
      runtime_error: 'technicalErrorRuntimeIncompatible',
      general_timeout: 'technicalErrorGeneralTimeout',
      permission_denied: 'technicalErrorPermissionDenied',
      rate_limited: 'technicalErrorRateLimited',
      unknown_technical: 'technicalErrorUnknown',
      // Pool-specific errors
      pool_full: 'poolErrorFull',
      pool_blocked: 'poolErrorBlocked',
      pool_destroying: 'poolErrorDestroying',
      pool_invalid_state: 'poolErrorInvalidState',
      pool_error: 'poolErrorInvalidState',
      // Staking-specific errors
      staking_error_min_bond: 'stakingErrorMinBond',
      staking_error_max_nominations: 'stakingErrorMaxNominations',
      staking_error_era_constraint: 'stakingErrorEraConstraint',
      staking_error: 'stakingErrorMinBond',
      // Commission errors
      commission_error_exceeds_max: 'commissionErrorExceedsMax',
      commission_error_exceeds_global: 'commissionErrorExceedsGlobal',
      commission_error_change_rate: 'commissionErrorChangeRate',
      commission_error_invalid_payee: 'commissionErrorInvalidPayee',
      commission_error: 'commissionErrorExceedsMax',
      // Balance errors
      balance_error_locked: 'balanceErrorLocked',
      balance_error_reserve_required: 'balanceErrorReserveRequired',
      balance_error_fee_calculation: 'balanceErrorFeeCalculation',
      balance_error: 'balanceErrorReserveRequired',
      // Validation errors
      validation_error_address_format: 'validationErrorAddressFormat',
      validation_error_metadata_too_long: 'validationErrorMetadataTooLong',
      validation_error_parameter_range: 'validationErrorParameterRange',
      validation_error_invalid_pool_id: 'validationErrorInvalidPoolId',
      validation_error_invalid_validator: 'validationErrorInvalidValidator',
      validation_error: 'validationErrorParameterRange',
    }

    const translationKey = errorKeyMap[details]
    return translationKey
      ? t(translationKey)
      : t('transactionCancelledTechnical')
  }

  // Re-fetch tx fee if tx changes
  const fetchTxFee = async () => {
    if (tx && from) {
      const { partialFee } = await tx.paymentInfo(from)
      updateFee(uid, partialFee)
    }
  }
  useEffect(() => {
    if (uid > 0) {
      fetchTxFee()
    }
  }, [uid, JSON.stringify(tx?.toHex())])

  return {
    txInitiated: !!tx,
    uid,
    onSubmit,
    submitAddress: from,
    proxySupported,
  }
}
