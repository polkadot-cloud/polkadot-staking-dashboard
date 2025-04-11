// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Apis } from 'controllers/Apis'
import type { PolkadotClient } from 'polkadot-api'
import type { ChainId } from 'types'

export class Base {
  #client: PolkadotClient

  constructor(network: ChainId) {
    this.#client = Apis.getClient(network)
  }

  get unsafeApi() {
    return this.#client.getUnsafeApi()
  }
}
