// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolUnbond extends Base {
  #who: string
  #bond: bigint

  constructor(network: ChainId, who: string, bond: bigint) {
    super(network)
    this.#who = who
    this.#bond = bond
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.unbond({
        member_account: {
          type: 'Id',
          value: this.#who,
        },
        unbonding_points: this.#bond,
      })
    } catch (e) {
      return null
    }
  }
}
