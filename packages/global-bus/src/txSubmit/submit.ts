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
  { onError, ...onRest }: TxStatusHandlers
) => {
  try {
    subs[uid] = await tx.signAndSend(
      from,
      { signer, nonce },
      async ({ status }) => {
        handleResult(uid, status, onRest)
      }
    )
  } catch (e) {
    onError('default')
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
    onError('default')
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
    onFailed(Error('Invalid'))
    deleteTx(uid)
  }
}
