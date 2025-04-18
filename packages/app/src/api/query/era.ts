// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class Era extends Base {
  constructor(network: ChainId) {
    super(network)
  }

  async fetch() {
    let activeEra = {
      start: 0n,
      index: 0,
    }
    try {
      const result = await this.unsafeApi.query.Staking.ActiveEra.getValue({
        at: 'best',
      })
      if (result) {
        activeEra = {
          index: result.index,
          start: result?.start || 0n,
        }
      }
    } catch (e) {
      // Silent fail
    }
    // Get previous era
    const previousEra = Math.max(activeEra.index - 1, 0)

    return {
      activeEra,
      previousEra,
    }
  }
}
