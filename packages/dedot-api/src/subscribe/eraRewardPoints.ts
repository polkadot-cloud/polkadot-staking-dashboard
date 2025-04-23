// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { PalletStakingEraRewardPoints } from 'dedot/chaintypes'
import type { Unsub } from 'dedot/types'
import { setEraRewardPoints } from 'global-bus'
import type { Chain } from '../types'

export class EraRewardPointsQuery<T extends Chain> {
  eraRewardPoints: PalletStakingEraRewardPoints = {
    total: 0,
    individual: [],
  }

  #unsub: Unsub | undefined = undefined

  constructor(
    public api: DedotClient<T>,
    public era: number
  ) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.query.staking.erasRewardPoints(
      this.era,
      (result) => {
        if (result) {
          this.eraRewardPoints = result
          setEraRewardPoints(this.eraRewardPoints)
        }
      }
    )
  }

  unsubscribe() {
    this.#unsub?.()
  }
}
