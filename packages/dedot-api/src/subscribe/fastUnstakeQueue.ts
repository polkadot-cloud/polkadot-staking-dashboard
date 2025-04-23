// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { setFastUnstakeQueue } from 'global-bus'
import type { StakingChain } from '../types'

export class FastUnstakeQueueQuery<T extends StakingChain> {
  queue: bigint = 0n

  #unsub: Unsub | undefined = undefined

  constructor(
    public api: DedotClient<T>,
    public address: string
  ) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.query.fastUnstake.queue(
      this.address,
      (result) => {
        this.queue = result || 0n
        setFastUnstakeQueue({ address: this.address, queue: this.queue })
      }
    )
  }

  unsubscribe() {
    setFastUnstakeQueue(undefined)
    this.#unsub?.()
  }
}
