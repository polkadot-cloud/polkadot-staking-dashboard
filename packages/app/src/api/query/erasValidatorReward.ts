// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class ErasValidatorReward {
  #api: PapiApi;
  #era: number;

  constructor(api: PapiApi, era: number) {
    this.#api = api;
    this.#era = era;
  }

  async fetch() {
    try {
      const result = await this.#api.query.Staking.ErasValidatorReward.getValue(
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
