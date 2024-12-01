// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'common-types';
import { Apis } from 'controllers/Apis';
import type { PolkadotClient } from 'polkadot-api';

export class Base {
  #client: PolkadotClient;

  constructor(network: ChainId) {
    this.#client = Apis.getClient(network);
  }

  get unsafeApi() {
    return this.#client.getUnsafeApi();
  }
}
