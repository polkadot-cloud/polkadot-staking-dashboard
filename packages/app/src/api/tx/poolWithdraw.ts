// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolWithdraw extends Base {
  #who: string
  #numSlashingSpans: number

  constructor(network: ChainId, who: string, numSlashingSpans: number) {
    super(network)
    this.#who = who
    this.#numSlashingSpans = numSlashingSpans
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.withdraw_unbonded({
        member_account: {
          type: 'Id',
          value: this.#who,
        },
        num_slashing_spans: this.#numSlashingSpans,
      })
    } catch (e) {
      return null
    }
  }
}
