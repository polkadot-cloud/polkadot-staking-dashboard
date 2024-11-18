// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class ProxiesQuery {
  #pApi: PapiApi;

  #address: string;

  constructor(pApi: PapiApi, address: string) {
    this.#pApi = pApi;
    this.#address = address;
  }

  async fetch() {
    try {
      const result = await this.#pApi.query.Proxy.Proxies.getValue(
        this.#address
      );
      return result;
    } catch (e) {
      // Subscription failed.
    }

    return undefined;
  }
}
