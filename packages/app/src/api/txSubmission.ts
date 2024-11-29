// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export class TxSubmission {
  // UID and whether the tx is processing.
  static uids: [number, boolean][] = [];

  static addUid() {
    const newUid = this.uids.length + 1;
    this.uids.push([newUid, false]);
    this.dispatchEvent();
    return newUid;
  }

  static removeUid(id: number) {
    this.uids = this.uids.filter(([uid]) => uid !== id);
    this.dispatchEvent();
  }

  static setUidProcessing(id: number, newProcessing: boolean) {
    this.uids = this.uids.map(([uid, processing]) =>
      uid === id ? [uid, newProcessing] : [uid, processing]
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
