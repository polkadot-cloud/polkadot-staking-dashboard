// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasRewardPoints {
  #pApi: PapiApi;

  #era: number;

  constructor(pApi: PapiApi, era: number) {
    this.#pApi = pApi;
    this.#era = era;
  }

  async fetch() {
    try {
      const result = await this.#pApi.query.Staking.ErasRewardPoints.getValue(
        this.#era,
        {
          at: 'best',
        }
      );
      return result;
    } catch (e) {
      // Silently fail.
    }

    return [];
  }
}
