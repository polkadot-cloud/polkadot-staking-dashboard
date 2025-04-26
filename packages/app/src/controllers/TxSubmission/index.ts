// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SubmittableExtrinsic } from 'dedot'
import type { InjectedSigner, Unsub } from 'dedot/types'
import type { MaybeAddress } from 'types'
import type { TxSubmissionItem } from './types'

export class TxSubmission {
  // Transaction items
  static uids: TxSubmissionItem[] = []

  // Transaction subscriptions
  static subs: Record<number, Unsub> = {}

  static getUid(id: number) {
    return this.uids.find((item) => item.uid === id)
  }

  static addUid({ from, tag }: { from: MaybeAddress; tag?: string }) {
    // Ensure uid is unique
    const newUid = this.uids.length + 1
    // If tag already exists, delete the entry
    if (tag) {
      this.uids = this.uids.filter((item) => item.tag !== tag)
    }
    this.uids.push({
      uid: newUid,
      submitted: false,
      pending: false,
      from,
      fee: 0n,
      tag,
    })
    this.dispatchEvent()
    return newUid
  }

  static removeUid(id: number) {
    this.uids = this.uids.filter(({ uid }) => uid !== id)
    this.dispatchEvent()
  }

  static setUidSubmitted(id: number, newSubmitted: boolean) {
    this.uids = this.uids.map((item) =>
      item.uid === id ? { ...item, submitted: newSubmitted } : item
    )
    this.dispatchEvent()
  }

  static setUidPending(id: number, newPending: boolean) {
    this.uids = this.uids.map((item) =>
      item.uid === id ? { ...item, pending: newPending } : item
    )
    this.dispatchEvent()
  }

  static updateFee(uid: number, fee: bigint) {
    this.uids = this.uids.map((item) =>
      item.uid === uid ? { ...item, fee } : item
    )
    this.dispatchEvent()
  }

  static async addSub(
    uid: number,
    from: string,
    tx: SubmittableExtrinsic,
    signer: InjectedSigner,
    nonce: number,
    {
      onReady,
      onInBlock,
      onFinalized,
      onFailed,
      onError,
    }: {
      onReady: () => void
      onInBlock: () => void
      onFinalized: () => void
      onFailed: (err: Error) => void
      onError: (type?: string) => void
    }
  ) {
    try {
      this.subs[uid] = await tx.signAndSend(
        from,
        { signer, nonce },
        async (result) => {
          const { status } = result

          if (status.type === 'Broadcasting') {
            this.setUidPending(uid, true)
            onReady()
          }
          if (status.type === 'BestChainBlockIncluded') {
            onInBlock()
            this.setUidSubmitted(uid, false)
            this.setUidPending(uid, false)
          }
          if (status.type === 'Finalized') {
            onFinalized()
            this.deleteTx(uid)
          }
          if (status.type === 'Invalid') {
            onFailed(Error('Invalid'))
          }
          this.deleteTx(uid)
        }
      )
    } catch (e) {
      onError('default')
      this.deleteTx(uid)
    }
  }
  static removeSub(uid: number) {
    const sub = this.subs[uid]
    if (sub) {
      sub()
      this.subs = Object.fromEntries(
        Object.entries(this.subs).filter(([key]) => Number(key) !== uid)
      )
    }
  }

  static deleteTx(uid: number) {
    this.setUidSubmitted(uid, false)
    this.setUidPending(uid, false)
    this.removeUid(uid)
    this.removeSub(uid)
  }

  static dispatchEvent = () => {
    document.dispatchEvent(
      new CustomEvent('new-tx-uid-status', {
        detail: {
          uids: this.uids,
        },
      })
    )
  }

  static pendingTxCount(from: string) {
    return this.uids.filter(
      (item) => item.from === from && item.pending === true
    ).length
  }
}
