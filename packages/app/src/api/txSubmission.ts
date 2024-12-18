// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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
    this.uids.push({ uid: newUid, processing: false, from, fee: 0n, tag })
    this.dispatchEvent()
    return newUid
  }

  static removeUid(id: number) {
    this.uids = this.uids.filter(({ uid }) => uid !== id)
    this.dispatchEvent()
  }

  static setUidProcessing(id: number, newProcessing: boolean) {
    this.uids = this.uids.map((item) =>
      item.uid === id ? { ...item, processing: newProcessing } : item
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { onReady, onInBlock, onFinalized, onFailed, onError }: any
  ) {
    try {
      this.subs[uid] = tx.signSubmitAndWatch(signer).subscribe({
        next: (result: { type: string }) => {
          const eventType = result?.type

          if (eventType === 'broadcasted') {
            onReady()
          }
          if (eventType === 'txBestBlocksState') {
            this.setUidProcessing(uid, false)
            onInBlock()
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
    this.setUidProcessing(uid, false)
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
}
