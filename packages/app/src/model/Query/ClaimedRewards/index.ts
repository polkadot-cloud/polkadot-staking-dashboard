// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ClaimedRewards {
  #pApi: PapiApi;

  #era: string;

  #address: string;

  constructor(pApi: PapiApi, era: string, address: string) {
    this.#pApi = pApi;
    this.#era = era;
    this.#address = address;
  }

  async fetch() {
    try {
      const result = await this.#pApi.query.Staking.ClaimedRewards.getValue(
        this.#era,
        this.#address,
        {
          at: 'best',
        }
      );
      return result;
    } catch (e) {
      // Silently fail.
    }

    return undefined;
  }
}
