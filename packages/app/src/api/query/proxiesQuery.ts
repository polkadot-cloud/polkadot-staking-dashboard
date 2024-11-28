// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class ProxiesQuery extends Base {
  #address: string;

  constructor(client: PolkadotClient, address: string) {
    super(client);
    this.#address = address;
  }

  async fetch() {
    try {
      const result = await this.unsafeApi.query.Proxy.Proxies.getValue(
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
