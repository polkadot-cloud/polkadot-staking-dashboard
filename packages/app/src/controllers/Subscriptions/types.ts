// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountBalances } from 'model/Subscribe/AccountBalances';
import type { AccountProxies } from 'model/Subscribe/AccountProxies';
import type { ActiveEra } from 'model/Subscribe/ActiveEra';
import type { BlockNumber } from 'model/Subscribe/BlockNumber';
import type { Bonded } from 'model/Subscribe/Bonded';
import type { FastUnstakeConfig } from 'model/Subscribe/FastUnstakeConfig';
import type { FastUnstakeQueue } from 'model/Subscribe/FastUnstakeQueue';
import type { NetworkMetrics } from 'model/Subscribe/NetworkMetrics';
import type { PoolsConfig } from 'model/Subscribe/PoolsConfig';
import type { StakingMetrics } from 'model/Subscribe/StakingMetrics';

// Define all possible subscription classes.
export type Subscription =
  | AccountBalances
  | AccountProxies
  | ActiveEra
  | BlockNumber
  | Bonded
  | FastUnstakeConfig
  | FastUnstakeQueue
  | NetworkMetrics
  | PoolsConfig
  | StakingMetrics;

// the record of subscriptions, keyed by tabId.
export type ChainSubscriptions = Record<string, Subscription>;

// Abstract class that ensures all subscription classes have an unsubscribe method.
export abstract class Unsubscribable {
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}
