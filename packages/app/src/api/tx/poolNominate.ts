// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';

export class PoolNominate extends Base {
  #poolId: number;
  #nominees: string[];

  constructor(network: ChainId, poolId: number, nominees: string[]) {
    super(network);
    this.#poolId = poolId;
    this.#nominees = nominees;
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.nominate({
        pool_id: this.#poolId,
        validators: this.#nominees,
      });
    } catch (e) {
      return null;
    }
  }
}
