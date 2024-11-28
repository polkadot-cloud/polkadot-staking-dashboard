// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class ProxiesQuery {
  #api: PapiApi;

  #address: string;

  constructor(api: PapiApi, address: string) {
    this.#api = api;
    this.#address = address;
  }

  async fetch() {
    try {
      const result = await this.#api.query.Proxy.Proxies.getValue(
        this.#address,
        { at: 'best' }
      );
      return result;
    } catch (e) {
      // Subscription failed.
    }

    return undefined;
  }
}
