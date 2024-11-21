// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ValidatorsMulti {
  #pApi: PapiApi;

  #addresses: [string][];

  constructor(pApi: PapiApi, addresses: [string][]) {
    this.#pApi = pApi;
    this.#addresses = addresses;
  }

  async fetch() {
    try {
      const result = await this.#pApi.query.Staking.Validators.getValues(
        this.#addresses,
        { at: 'best' }
      );
      return result;
    } catch (e) {
      // Silently fail.
    }

    return null;
  }
}
