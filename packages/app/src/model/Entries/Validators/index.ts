// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class Validators {
  #pApi: PapiApi;

  constructor(pApi: PapiApi) {
    this.#pApi = pApi;
  }

  async fetch() {
    return await this.#pApi.query.Staking.Validators.getEntries({ at: 'best' });
  }
}
