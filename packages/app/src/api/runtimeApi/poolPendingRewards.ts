// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolPendingRewards extends Base {
  #who: string

  constructor(network: ChainId, who: string) {
    super(network)
    this.#who = who
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.apis.NominationPoolsApi.pending_rewards(
          this.#who,
          {
            at: 'best',
          }
        )
      return result
    } catch (e) {
      // Silently fail.
    }
    return undefined
  }
}
