// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class ValidatorsEntries {
  #api: PapiApi;

  constructor(api: PapiApi) {
    this.#api = api;
  }

  async fetch() {
    return await this.#api.query.Staking.Validators.getEntries({ at: 'best' });
  }
}
