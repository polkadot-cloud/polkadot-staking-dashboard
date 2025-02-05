// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { EraRewardPoints } from 'api/types'
import type { NetworkId } from 'common-types'
import { Apis } from 'controllers/Apis'
import type { Unsubscribable } from 'controllers/Subscriptions/types'
import type { ActiveValidatorRank } from 'plugin-staking-api/types'
import type { Subscription } from 'rxjs'

export class ErasRewardPoints implements Unsubscribable {
  // The associated network for this instance
  #network: NetworkId

  // The era to query
  #era: number

  // Active subscription
  #sub: Subscription

  // Store the era reward points
  eraRewardPoints: EraRewardPoints = {
    total: 0,
    individual: {},
  }

  // Store era raward points ranks
  ranks: ActiveValidatorRank[] = []

  // Store the era high value
  eraHigh: number = 0

  constructor(network: NetworkId, era: number) {
    this.#network = network
    this.#era = era
    this.subscribe()
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network)

      if (api && this.#sub === undefined) {
        // Testing the active era subscription.
        const bestOrFinalized = 'best'
        const sub = api.query.Staking.ErasRewardPoints.watchValue(
          this.#era,
          bestOrFinalized
        ).subscribe((eraRewardPoints) => {
          this.eraRewardPoints = eraRewardPoints
          this.eraHigh = Object.values(this.eraRewardPoints.individual).sort(
            (a, b) => b[1] - a[1]
          )[0][1]

          const sortedValidators = [...eraRewardPoints.individual].sort(
            (a, b) => b[1] - a[1]
          )
          this.ranks = sortedValidators.map(([validator], index) => ({
            validator,
            rank: index + 1, // Rank starts from 1
          }))

          document.dispatchEvent(
            new CustomEvent('new-era-reward-points', {
              detail: { eraRewardPoints, eraHigh: this.eraHigh },
            })
          )
        })
        this.#sub = sub
      }
    } catch (e) {
      // Subscription failed
    }
  }

  // Unsubscribe from class subscription
  unsubscribe = (): void => {
    if (typeof this.#sub?.unsubscribe === 'function') {
      this.#sub.unsubscribe()
    }
  }

  // Get an individual era points value
  getIndividualEraPoints = (address: string): number => {
    const individual = Object.values(this.eraRewardPoints.individual)
    const entry = individual.find((item) => item[0] === address)
    return entry?.[1] || 0
  }

  // Gets an individual rank for a validator
  getRank = (address: string): number | null => {
    const rank = this.ranks.find((r) => r.validator === address)
    return rank?.rank || null
  }
}
