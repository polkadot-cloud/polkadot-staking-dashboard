// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { addProxies, removeProxies } from 'global-bus'
import type { Proxies } from 'types'
import type { StakingChain } from '../types'

export class ProxiesQuery<T extends StakingChain> {
  #unsub: Unsub | undefined = undefined

  constructor(
    public api: DedotClient<T>,
    public address: string
  ) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = (await this.api.query.proxy.proxies(
      this.address,
      (result) => {
        const [proxies, deposit] = result
        const next: Proxies = {
          proxies: proxies.map(({ delegate, proxyType, delay }) => ({
            delegate,
            proxyType,
            delay,
          })),
          deposit,
        }
        addProxies(this.address, next)
      }
    )) as Unsub
  }

  unsubscribe() {
    removeProxies(this.address)
    this.#unsub?.()
  }
}
