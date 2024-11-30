// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';
import type { TxSubmissionItem } from './types';

export class TxSubmission {
  static uids: TxSubmissionItem[] = [];

  static addUid({ from, tag }: { from: MaybeAddress; tag?: string }) {
    // If tag already exists, delete the entry.
    if (tag) {
      this.uids = this.uids.filter((item) => item.tag !== tag);
    }
    const newUid = this.uids.length + 1;
    this.uids.push({ uid: newUid, processing: false, from, fee: 0n, tag });
    this.dispatchEvent();
    return newUid;
  }

  static updateFee(uid: number, fee: bigint) {
    this.uids = this.uids.map((item) =>
      item.uid === uid ? { ...item, fee } : item
    );
    this.dispatchEvent();
  }

  static removeUid(id: number) {
    this.uids = this.uids.filter(({ uid }) => uid !== id);
    this.dispatchEvent();
  }

  static setUidProcessing(id: number, newProcessing: boolean) {
    this.uids = this.uids.map((item) =>
      item.uid === id ? { ...item, processing: newProcessing } : item
    );
    this.dispatchEvent();
  }

  static dispatchEvent = () => {
    document.dispatchEvent(
      new CustomEvent('new-tx-uid-status', {
        detail: {
          uids: this.uids,
        },
      })
    );
  };
}
