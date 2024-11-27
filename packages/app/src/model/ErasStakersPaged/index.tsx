// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasStakersPaged {
  #api: PapiApi;

  constructor(api: PapiApi) {
    this.#api = api;
  }

  async fetch(era: number, validator: string) {
    return await this.#api.query.Staking.ErasStakersPaged.getEntries(
      era,
      validator,
      { at: 'best' }
    );
  }
}
