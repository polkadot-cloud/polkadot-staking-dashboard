// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class SessionValidators {
  #pApi: PapiApi;

  constructor(pApi: PapiApi) {
    this.#pApi = pApi;
  }

  // Fetch network constants.
  async fetch() {
    try {
      const result = await this.#pApi.query.Session.Validators.getValue({
        at: 'best',
      });
      return result;
    } catch (e) {
      // Silently fail.
    }
    return [];
  }
}
