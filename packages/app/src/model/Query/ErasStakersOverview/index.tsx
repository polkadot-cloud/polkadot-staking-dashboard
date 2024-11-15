// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ErasStakersOverview {
  #pApi: PapiApi;

  constructor(pApi: PapiApi) {
    this.#pApi = pApi;
  }

  async fetch(era: string) {
    return await this.#pApi.query.Staking.ErasStakersOverview.getEntries(era);
  }
}
