// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class BlockNumber extends Base {
  constructor(network: ChainId) {
    super(network)
  }

  async fetch() {
    try {
      const result = await this.unsafeApi.query.System.Number.getValue({
        at: 'best',
      })
      return result
    } catch (e) {
      // Silently fail.
    }

    return undefined
  }
}
