// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ParaSessionAccounts {
  #api: PapiApi;
  #session: number;

  constructor(api: PapiApi, session: number) {
    this.#api = api;
    this.#session = session;
  }

  async fetch() {
    try {
      const result = await this.#api.query.ParaSessionInfo.AccountKeys.getValue(
        this.#session,
        { at: 'best' }
      );

      if (result) {
        return result;
      }
    } catch (e) {
      // Silent fail
    }

    return [];
  }
}
