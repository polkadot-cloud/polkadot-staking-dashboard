// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class PoolBalanceToPoints extends Base {
  #poolId: number
  #balance: bigint

  constructor(network: ChainId, poolId: number, balance: bigint) {
    super(network)
    this.#poolId = poolId
    this.#balance = balance
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.apis.NominationPoolsApi.balance_to_points(
          this.#poolId,
          this.#balance,
          { at: 'best' }
        )
      return result
    } catch (e) {
      // Silently fail.
    }
    return undefined
  }
}
