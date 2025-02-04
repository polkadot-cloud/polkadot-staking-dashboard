// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'common-types'
import type { ChainSubscriptions, Subscription } from './types'

// A class to manage subscriptions.

export class Subscriptions {
  // Subscription objects, keyed by an network
  static #subs: Partial<Record<ChainId, ChainSubscriptions>> = {}

  static get subs() {
    return this.#subs
  }

  // Gets all subscriptions for a network
  static getAll(network: ChainId): ChainSubscriptions | undefined {
    return this.#subs[network]
  }

  // Get a subscription by network and subscriptionId
  static get(
    network: ChainId,
    subscriptionId: string
  ): Subscription | undefined {
    return this.#subs[network]?.[subscriptionId] || undefined
  }

  // Sets a new subscription for a network
  static set(
    network: ChainId,
    subscriptionId: string,
    subscription: Subscription
  ): void {
    // Ignore if there is already a subscription for this network and subscriptionId
    if (this.#subs?.[network]?.[subscriptionId]) {
      return
    }

    // Create a new subscriptions record for the network if one doesn't exist
    if (!this.#subs[network]) {
      this.#subs[network] = {}
    }

    // NOTE: We know for certain that `this.#subs[network]` is defined here
    this.#subs[network]![subscriptionId] = subscription
  }

  // Unsubscribe from a subscription and remove it from class state
  static remove(network: ChainId, subscriptionId: string): void {
    if (this.#subs[network]) {
      try {
        delete this.#subs[network]![subscriptionId]
      } catch (e) {
        // Silently fail if the subscription doesn't exist`
      }
    }
  }
}
