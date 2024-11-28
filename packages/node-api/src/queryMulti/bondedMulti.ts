// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class BondedMulti {
  #api: PapiApi;

  #addresses: [string][];

  constructor(api: PapiApi, eras: [string][]) {
    this.#api = api;
    this.#addresses = eras;
  }

  async fetch() {
    try {
      const results = await this.#api.query.Staking.Bonded.getValues(
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
