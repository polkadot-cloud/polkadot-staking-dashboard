// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Apis } from 'controllers/Apis'
import type { Unsubscribable } from 'controllers/Subscriptions/types'
import { defaultActiveEra } from 'global-bus'
import type { Subscription } from 'rxjs'
import type { ActiveEra as IActiveEra, NetworkId } from 'types'

export class ActiveEra implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkId

  // Active subscription.
  #sub: Subscription

  // Store the active era.
  activeEra: IActiveEra = defaultActiveEra

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
            index: activeEra?.index || 0,
            start: activeEra?.start || 0n,
          }
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
