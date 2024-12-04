// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolChill extends Base {
  #poolId: number

  constructor(network: ChainId, poolId: number) {
    super(network)
    this.#poolId = poolId
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.chill({ pool_id: this.#poolId })
    } catch (e) {
      return null
    }
  }
}
