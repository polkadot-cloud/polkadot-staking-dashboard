// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotSigner } from 'polkadot-api'
import type { Subscription } from 'rxjs'
import type { MaybeAddress } from 'types'
import type { TxSubmissionItem } from './types'

export class TxSubmission {
  // Transaction items
  static uids: TxSubmissionItem[] = []

  // Transaction subscriptions
  static subs: Record<number, Subscription> = {}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx: any,
    signer: PolkadotSigner,
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
      this.subs[uid] = tx.signSubmitAndWatch(signer, { nonce }).subscribe({
        next: (result: { type: string }) => {
          const eventType = result?.type

          if (eventType === 'broadcasted') {
            this.setUidPending(uid, true)
            onReady()
          }
          if (eventType === 'txBestBlocksState') {
            onInBlock()
            this.setUidSubmitted(uid, false)
            this.setUidPending(uid, false)
          }
          if (eventType === 'finalized') {
            onFinalized()
            this.deleteTx(uid)
          }
        },
        error: (err: Error) => {
          onFailed(err)
          this.deleteTx(uid)
        },
      })
    } catch (e) {
      onError('default')
      this.deleteTx(uid)
    }
  }

  static removeSub(uid: number) {
    const sub = this.subs[uid]
    if (sub) {
      sub.unsubscribe()
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
