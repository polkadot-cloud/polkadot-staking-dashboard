// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolSetCommission extends Base {
  #poolId: number
  #commission?: [number, string]

  constructor(network: ChainId, poolId: number, commission?: [number, string]) {
    super(network)
    this.#poolId = poolId
    this.#commission = commission
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.set_commission({
        pool_id: this.#poolId,
        new_commission: this.#commission,
      })
    } catch (e) {
      return null
    }
  }
}
