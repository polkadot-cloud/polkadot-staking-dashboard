// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';

export class TransferKeepAlive extends Base {
  #to: string;
  #value: bigint;

  constructor(network: ChainId, to: string, value: bigint) {
    super(network);
    this.#to = to;
    this.#value = value;
  }

  tx() {
    try {
      return this.unsafeApi.tx.Balances.transfer_keep_alive({
        dest: {
          type: 'Id',
          value: this.#to,
        },
        value: this.#value,
      });
    } catch (e) {
      return null;
    }
  }
}
