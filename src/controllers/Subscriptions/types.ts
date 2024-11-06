// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveEra } from 'model/Subscribe/ActiveEra';
import type { BlockNumber } from 'model/Subscribe/BlockNumber';
import type { NetworkMetrics } from 'model/Subscribe/NetworkMetrics';
import type { PoolsConfig } from 'model/Subscribe/PoolsConfig';
import type { StakingMetrics } from 'model/Subscribe/StakingMetrics';
import type { ChainSpec } from 'model/Observables/ChainSpec';
import type { TaggedMetadata } from 'model/Observables/TaggedMetadata';

// Define all possible subscription classes.
export type Subscription = UnsubSubscription | ObservableGetter;

// Polkadot JS API subscriptions (unsubscribe functions).
export type UnsubSubscription =
  | ActiveEra
  | BlockNumber
  | NetworkMetrics
  | PoolsConfig
  | StakingMetrics;

// the record of subscriptions, keyed by tabId.
export type ChainSubscriptions = Record<string, Subscription>;

// Polkadot API Getters (observables wrapped in an async function that resolve upon completion).
export type ObservableGetter = ChainSpec | TaggedMetadata;

// Abstract class that ensures all subscription classes have an unsubscribe method.
export abstract class Unsubscribable {
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}

// Abstract class that allows an await-able function to get a value from an observable.
export abstract class ObservableGetSubscription {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare get: () => Promise<any>;
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}
