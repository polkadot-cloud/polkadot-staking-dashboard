// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { Binary } from 'polkadot-api';
import type { ChainId } from 'types';

export class PoolSetMetadata extends Base {
  #poolId: number;
  #metadata: Binary;

  constructor(network: ChainId, poolId: number, metadata: Binary) {
    super(network);
    this.#poolId = poolId;
    this.#metadata = metadata;
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.set_metadata({
        pool_id: this.#poolId,
        metadata: this.#metadata,
      });
    } catch (e) {
      return null;
    }
  }
}
