// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasValidatorReward {
  #api: PapiApi;
  #eras: [number][];

  constructor(api: PapiApi, eras: [number][]) {
    this.#api = api;
    this.#eras = eras;
  }

  async fetch() {
    try {
      const results =
        await this.#api.query.Staking.ErasValidatorReward.getValues(
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
