// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { setActiveEra } from 'global-bus'
import type { ActiveEra } from 'types'
import type { StakingChain } from '../types'

export class ActiveEraQuery<T extends StakingChain> {
  activeEra: ActiveEra = {
    index: 0,
    start: 0n,
  }
  #unsub: Unsub | undefined = undefined

  constructor(public api: DedotClient<T>) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.query.staking.activeEra((result) => {
      if (result) {
        this.activeEra = {
          index: result.index,
          start: result.start || 0n,
        }
        setActiveEra(this.activeEra)
      }
    })
  }

  unsubscribe() {
    this.#unsub?.()
  }
}
