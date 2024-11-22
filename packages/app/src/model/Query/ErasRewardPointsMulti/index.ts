// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasRewardPointsMulti {
  #pApi: PapiApi;

  #eras: [number][];

  constructor(pApi: PapiApi, eras: [number][]) {
    this.#pApi = pApi;
    this.#eras = eras;
  }

  async fetch() {
    try {
      const results = await this.#pApi.query.Staking.ErasRewardPoints.getValues(
        this.#eras,
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
