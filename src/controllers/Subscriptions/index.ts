// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkName, SystemChainId } from 'types';
import {
  ObservableGetSubscription,
  Unsubscribable,
  type ChainSubscriptions,
  type Subscription,
  type UnsubSubscription,
} from './types';

// A class to manage subscriptions.

export class SubscriptionsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Subscription objects, keyed by an network.
  static #subs: Partial<
    Record<NetworkName | SystemChainId, ChainSubscriptions>
  > = {};

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  static get subs() {
    return this.#subs;
  }

  // Gets all subscriptions for a network.
  static getAll(
    network: NetworkName | SystemChainId
  ): ChainSubscriptions | undefined {
    return this.#subs[network];
  }

  // Get a subscription by network and subscriptionId.
  static get(
    network: NetworkName | SystemChainId,
    subscriptionId: string
  ): UnsubSubscription | undefined {
    const subscription = this.#subs[network]?.[subscriptionId];
    if (!(subscription instanceof Unsubscribable)) {
      return undefined;
    }
    return subscription as UnsubSubscription;
  }

  // Get an observable getter by network and subscriptionId.
  static getObservableGetter(
    network: NetworkName | SystemChainId,
    subscriptionId: string
  ): ObservableGetSubscription | undefined {
    const subscription = this.#subs[network]?.[subscriptionId];
    if (!(subscription instanceof ObservableGetSubscription)) {
      return undefined;
    }
    return subscription as ObservableGetSubscription;
  }

  // ------------------------------------------------------
  // Setter.
  // ------------------------------------------------------

  // Sets a new subscription for a network.
  static set(
    network: NetworkName | SystemChainId,
    subscriptionId: string,
    subscription: Subscription
  ): Subscription | undefined {
    // Ignore if there is already a subscription for this network and subscriptionId.
    if (this.#subs?.[network]?.[subscriptionId]) {
      return;
    }

    // Create a new subscriptions record for the network if one doesn't exist.
    if (!this.#subs[network]) {
      this.#subs[network] = {};
    }

    // NOTE: We know for certain that `this.#subs[network]` is defined here.
    this.#subs[network]![subscriptionId] = subscription;

    return subscription;
  }

  // ------------------------------------------------------
  // Unsubscribe.
  // ------------------------------------------------------

  // Unsubscribe from a subscription and remove it from class state.
  static remove(
    network: NetworkName | SystemChainId,
    subscriptionId: string
  ): void {
    if (this.#subs[network]) {
      try {
        delete this.#subs[network]![subscriptionId];
      } catch (e) {
        // Silently fail if the subscription doesn't exist.
      }
    }
  }
}
