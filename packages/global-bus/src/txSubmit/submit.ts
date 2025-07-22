// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SubmittableExtrinsic } from 'dedot'
import type { ExtrinsicSignatureV4 } from 'dedot/codecs'
import type { InjectedSigner, TxStatus } from 'dedot/types'
import type { TxStatusHandlers } from 'types'
import { getErrorKeyFromMessage } from './error'
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
    const technicalDetails = getErrorKeyFromMessage(errorMessage)
    onError('technical', technicalDetails)
  }
}
