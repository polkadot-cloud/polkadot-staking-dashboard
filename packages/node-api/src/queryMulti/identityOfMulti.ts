// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class IdentityOfMulti {
  #api: PapiApi;

  #addresses: [string][];

  constructor(api: PapiApi, addresses: [string][]) {
    this.#api = api;
    this.#addresses = addresses;
  }

  async fetch() {
    try {
      const result = await this.#api.query.Identity.IdentityOf.getValues(
        this.#addresses,
        {
          at: 'best',
        }
      );
      return result;
    } catch (e) {
      // Silently fail.
    }

    return null;
  }
}
