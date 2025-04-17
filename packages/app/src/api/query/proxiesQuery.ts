// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class ProxiesQuery extends Base {
  #address: string

  constructor(network: ChainId, address: string) {
    super(network)
    this.#address = address
  }

  async fetch() {
    try {
      const result = await this.unsafeApi.query.Proxy.Proxies.getValue(
        this.#address,
        { at: 'best' }
      )
      return result
    } catch (e) {
      // Subscription failed.
    }

    return undefined
  }
}
