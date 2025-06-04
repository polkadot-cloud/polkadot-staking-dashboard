// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { removeBonded, setBonded } from 'global-bus'
import type { Bonded } from 'types'
import type { StakingChain } from '../types'

export class BondedQuery<T extends StakingChain> {
  #unsub: Unsub | undefined = undefined

  constructor(
    public api: DedotClient<T>,
    public address: string
  ) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.query.staking.bonded(
      this.address,
      async (result) => {
        const bonded: Bonded = {
          stash: this.address,
          bonded: result
            ? result.address(this.api.consts.system.ss58Prefix)
            : undefined,
        }

        if (bonded) {
          setBonded(bonded)
        } else {
          removeBonded(this.address)
        }
      }
    )
  }

  unsubscribe() {
    this.#unsub?.()
    removeBonded(this.address)
  }
}
