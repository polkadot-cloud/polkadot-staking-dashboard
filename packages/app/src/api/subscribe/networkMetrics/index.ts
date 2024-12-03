// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { NetworkId } from 'common-types'
import { Apis } from 'controllers/Apis'
import type { Unsubscribable } from 'controllers/Subscriptions/types'
import type { Subscription } from 'rxjs'
import { combineLatest } from 'rxjs'

export class NetworkMetrics implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkId

  // Active subscription.
  #sub: Subscription

  constructor(network: NetworkId) {
    this.#network = network
    this.subscribe()
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network)

      if (api && this.#sub === undefined) {
        const bestOrFinalized = 'best'
        const sub = combineLatest([
          api.query.Balances.TotalIssuance.watchValue(bestOrFinalized),
          api.query.Auctions.AuctionCounter.watchValue(bestOrFinalized),
          api.query.ParaSessionInfo.EarliestStoredSession.watchValue(
            bestOrFinalized
          ),
          api.query.FastUnstake.ErasToCheckPerBlock.watchValue(bestOrFinalized),
          api.query.Staking.MinimumActiveStake.watchValue(bestOrFinalized),
        ]).subscribe(
          ([
            totalIssuance,
            auctionCounter,
            earliestStoredSession,
            erasToCheckPerBlock,
            minimumActiveStake,
          ]) => {
            const networkMetrics = {
              totalIssuance: new BigNumber(totalIssuance.toString()),
              auctionCounter: new BigNumber(auctionCounter),
              earliestStoredSession: new BigNumber(earliestStoredSession),
              fastUnstakeErasToCheckPerBlock: Number(erasToCheckPerBlock),
              minimumActiveStake: new BigNumber(minimumActiveStake.toString()),
            }

            document.dispatchEvent(
              new CustomEvent('new-network-metrics', {
                detail: { networkMetrics },
              })
            )
          }
        )

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
