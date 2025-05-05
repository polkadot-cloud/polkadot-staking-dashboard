// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { defaultFastUnstakeConfig, setFastUnstakeConfig } from 'global-bus'
import type { FastUnstakeConfig } from 'types'
import type { StakingChain } from '../types'

export class FastUnstakeConfigQuery<T extends StakingChain> {
  config: FastUnstakeConfig = defaultFastUnstakeConfig

  #unsub: Unsub | undefined = undefined

  constructor(public api: DedotClient<T>) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.queryMulti(
      [
        {
          fn: this.api.query.fastUnstake.head,
          args: [],
        },
        {
          fn: this.api.query.fastUnstake.counterForQueue,
          args: [],
        },
      ],
      ([head, counterForQueue]) => {
        const stashes = head?.stashes || []
        const checked = head?.checked || []
        const config = {
          head: {
            stashes,
            checked,
          },
          counterForQueue,
        }
        this.config = config
        setFastUnstakeConfig(this.config)
      }
    )
  }

  unsubscribe() {
    this.#unsub?.()
  }
}
