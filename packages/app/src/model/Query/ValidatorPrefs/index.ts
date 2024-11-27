// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ValidatorPrefs {
  #api: PapiApi;
  #era: number;
  #address: string;

  constructor(api: PapiApi, era: number, address: string) {
    this.#api = api;
    this.#era = era;
    this.#address = address;
  }

  async fetch() {
    try {
      const result = await this.#api.query.Staking.ErasValidatorPrefs.getValue(
        this.#era,
        this.#address,
        { at: 'best' }
      );
      return result;
    } catch (e) {
      // Silently fail.
    }

    return undefined;
  }
}
