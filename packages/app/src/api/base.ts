// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotClient } from 'polkadot-api';

export class Base {
  #client: PolkadotClient;

  constructor(client: PolkadotClient) {
    this.#client = client;
  }

  get unsafeApi() {
    return this.#client.getUnsafeApi();
  }
}
