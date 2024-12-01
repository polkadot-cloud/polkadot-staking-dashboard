// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';

export class PoolSetCommissionChangeRate extends Base {
  #poolId: number;
  #maxIncrease?: number;
  #minDelay?: number;

  constructor(
    network: ChainId,
    poolId: number,
    maxIncrease: number,
    minDelay: number
  ) {
    super(network);
    this.#poolId = poolId;
    this.#maxIncrease = maxIncrease;
    this.#minDelay = minDelay;
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.set_commission_change_rate({
        pool_id: this.#poolId,
        change_rate: {
          max_increase: this.#maxIncrease,
          min_delay: this.#minDelay,
        },
      });
    } catch (e) {
      return null;
    }
  }
}
