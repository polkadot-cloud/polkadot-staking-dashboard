// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasValidatorReward {
  #pApi: PapiApi;

  #era: string;

  constructor(pApi: PapiApi, era: string) {
    this.#pApi = pApi;
    this.#era = era;
  }

  async fetch() {
    try {
      const result =
        await this.#pApi.query.Staking.ErasValidatorReward.getValue(this.#era, {
          at: 'best',
        });
      return result;
    } catch (e) {
      // Silently fail.
    }

    return [];
  }
}
