// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class PoolMetadataMulti {
  #api: PapiApi;

  #ids: [number][];

  constructor(api: PapiApi, ids: [number][]) {
    this.#api = api;
    this.#ids = ids;
  }

  async fetch() {
    try {
      const result = await this.#api.query.NominationPools.Metadata.getValues(
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
