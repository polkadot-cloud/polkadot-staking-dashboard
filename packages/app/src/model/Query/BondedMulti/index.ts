// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class BondedMulti {
  #pApi: PapiApi;

  #addresses: [string][];

  constructor(pApi: PapiApi, eras: [string][]) {
    this.#pApi = pApi;
    this.#addresses = eras;
  }

  async fetch() {
    try {
      const results = await this.#pApi.query.Staking.Bonded.getValues(
        this.#addresses,
        {
          at: 'best',
        }
      );
      return results;
    } catch (e) {
      // Silently fail.
    }

    return [];
  }
}
