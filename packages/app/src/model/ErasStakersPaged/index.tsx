// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasStakersPaged {
  #pApi: PapiApi;

  constructor(pApi: PapiApi) {
    this.#pApi = pApi;
  }

  async fetch(era: string, validator: string) {
    return await this.#pApi.query.Staking.ErasStakersPaged.getEntries(
      era,
      validator,
      { at: 'best' }
    );
  }
}
