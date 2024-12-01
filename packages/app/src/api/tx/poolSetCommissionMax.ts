// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';

export class PoolSetCommissionMax extends Base {
  #poolId: number;
  #max?: number;

  constructor(network: ChainId, poolId: number, max: number) {
    super(network);
    this.#poolId = poolId;
    this.#max = max;
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.set_commission_max({
        pool_id: this.#poolId,
        max_commission: this.#max,
      });
    } catch (e) {
      return null;
    }
  }
}
