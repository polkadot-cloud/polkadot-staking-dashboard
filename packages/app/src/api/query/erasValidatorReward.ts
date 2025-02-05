// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class ErasValidatorReward extends Base {
  #era: number

  constructor(network: ChainId, era: number) {
    super(network)
    this.#era = era
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.query.Staking.ErasValidatorReward.getValue(
          this.#era,
          {
            at: 'best',
          }
        )
      return result
    } catch (e) {
      // Silently fail.
    }

    return []
  }
}
