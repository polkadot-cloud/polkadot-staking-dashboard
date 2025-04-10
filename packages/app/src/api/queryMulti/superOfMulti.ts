// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class SuperOfMulti extends Base {
  #addresses: [string][]

  constructor(network: ChainId, addresses: [string][]) {
    super(network)
    this.#addresses = addresses
  }

  async fetch() {
    try {
      const result = await this.unsafeApi.query.Identity.SuperOf.getValues(
        this.#addresses,
        { at: 'best' }
      )
      return result
    } catch (e) {
      // Silently fail.
    }

    return null
  }
}
