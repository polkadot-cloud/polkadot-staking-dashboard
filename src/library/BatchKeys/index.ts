// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* A class to track the batch keys used throughout the app.
 * A batch key should be unique, acting as a key to a validator meta batch.
 * A console.error is executed in the event the same batch key is used more than once.
 */
export class BatchKeys {
  private static _batchKeys: Array<string> = [];

  static new(name: string): string {
    if (BatchKeys._batchKeys.includes(name)) {
      console.error(
        `Batch Key ${name} already exists. Batch keys must be unique.`
      );
    } else {
      BatchKeys._batchKeys.push(name);
    }
    return name;
  }
}
