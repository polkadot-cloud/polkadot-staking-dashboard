// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PoolState } from 'contexts/Pools/ActivePool/types';
import type { ChainId } from 'types';

export class PoolSetState extends Base {
  #poolId: number;
  #state: PoolState;

  constructor(network: ChainId, poolId: number, state: PoolState) {
    super(network);
    this.#poolId = poolId;
    this.#state = state;
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.set_state({
        pool_id: this.#poolId,
        state: { type: this.#state, value: undefined },
      });
    } catch (e) {
      return null;
    }
  }
}
