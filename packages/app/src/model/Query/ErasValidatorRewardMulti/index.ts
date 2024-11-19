// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasValidatorReward {
  #pApi: PapiApi;

  #eras: [string][];

  constructor(pApi: PapiApi, eras: [string][]) {
    this.#pApi = pApi;
    this.#eras = eras;
  }

  async fetch() {
    try {
      const results =
        await this.#pApi.query.Staking.ErasValidatorReward.getValues(
          this.#eras
        );
      return results;
    } catch (e) {
      // Silently fail.
    }

    return [];
  }
}
