// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { defaultActiveEra } from 'contexts/Api/defaults'
import type { APIActiveEra } from 'contexts/Api/types'
import { Apis } from 'controllers/Apis'
import { Subscriptions } from 'controllers/Subscriptions'
import type { Unsubscribable } from 'controllers/Subscriptions/types'
import type { Subscription } from 'rxjs'
import type { NetworkId } from 'types'
import { StakingMetrics } from '../stakingMetrics'

export class ActiveEra implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkId

  // Active subscription.
  #sub: Subscription

  // Store the active era.
  activeEra: APIActiveEra = defaultActiveEra

  constructor(network: NetworkId) {
    this.#network = network
    this.subscribe()
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network)

      if (api && this.#sub === undefined) {
        // Testing the active era subscription.
        const bestOrFinalized = 'best'
        const sub = api.query.Staking.ActiveEra.watchValue(
          bestOrFinalized
        ).subscribe((activeEra) => {
          // Store active era.
          this.activeEra = {
            index: new BigNumber(activeEra?.index || 0),
            start: new BigNumber(activeEra?.start || 0),
          }

          // Unsubscribe to staking metrics if it exists.
          const subStakingMetrics = Subscriptions.get(
            this.#network,
            'stakingMetrics'
          )
          if (subStakingMetrics) {
            subStakingMetrics.unsubscribe()
            Subscriptions.remove(this.#network, 'stakingMetrics')
          }

          // Subscribe to staking metrics with new active era.
          Subscriptions.set(
            this.#network,
            'stakingMetrics',
            new StakingMetrics(
              this.#network,
              this.activeEra,
              BigNumber.max(0, this.activeEra.index.minus(1))
            )
          )

          document.dispatchEvent(
            new CustomEvent('new-active-era', {
              detail: { activeEra },
            })
          )
        })
        this.#sub = sub
      }
    } catch (e) {
      // Subscription failed.
    }
  }

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#sub?.unsubscribe === 'function') {
      this.#sub.unsubscribe()
    }
  }
}
