// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolUnbond extends Base {
  #who: string
  #points: bigint

  constructor(network: ChainId, who: string, points: bigint) {
    super(network)
    this.#who = who
    this.#points = points
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.unbond({
        member_account: {
          type: 'Id',
          value: this.#who,
        },
        unbonding_points: this.#points,
      })
    } catch (e) {
      return null
    }
  }
}
