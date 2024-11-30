// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'types';

export class StakingWithdraw extends Base {
  #numSlashingSpans: number;

  constructor(network: ChainId, numSlashingSpans: number) {
    super(network);
    this.#numSlashingSpans = numSlashingSpans;
  }

  tx() {
    try {
      return this.unsafeApi.tx.Staking.withdraw_unbonded({
        num_slashing_spans: this.#numSlashingSpans,
      });
    } catch (e) {
      return null;
    }
  }
}
