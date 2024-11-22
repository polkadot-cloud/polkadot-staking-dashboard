// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ParaSessionAccounts {
  #pApi: PapiApi;
  #session: number;

  constructor(pApi: PapiApi, session: number) {
    this.#pApi = pApi;
    this.#session = session;
  }

  async fetch() {
    try {
      const result =
        await this.#pApi.query.ParaSessionInfo.AccountKeys.getValue(
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
