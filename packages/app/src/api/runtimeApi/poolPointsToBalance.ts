// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolPointsToBalance extends Base {
  #poolId: number
  #points: bigint

  constructor(network: ChainId, poolId: number, points: bigint) {
    super(network)
    this.#poolId = poolId
    this.#points = points
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.apis.NominationPoolsApi.points_to_balance(
          this.#poolId,
          this.#points,
          { at: 'best' }
        )
      return result
    } catch (e) {
      // Silently fail.
    }
    return undefined
  }
}
