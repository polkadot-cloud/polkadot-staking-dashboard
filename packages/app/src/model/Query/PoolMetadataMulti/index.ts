// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class PoolMetadataMulti {
  #pApi: PapiApi;

  #ids: [number][];

  constructor(pApi: PapiApi, ids: [number][]) {
    this.#pApi = pApi;
    this.#ids = ids;
  }

  async fetch() {
    try {
      const result = await this.#pApi.query.NominationPools.Metadata.getValues(
        this.#ids
      );
      return result.map((metadata) => metadata.asText());
    } catch (e) {
      // Silently fail.
    }

    return [];
  }
}
