// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class PoolMetadataMulti extends Base {
  #ids: [number][];

  constructor(client: PolkadotClient, ids: [number][]) {
    super(client);
    this.#ids = ids;
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.query.NominationPools.Metadata.getValues(
          this.#ids,
          { at: 'best' }
        );
      return result.map((metadata) => metadata.asText());
    } catch (e) {
      // Silently fail.
    }

    return [];
  }
}
