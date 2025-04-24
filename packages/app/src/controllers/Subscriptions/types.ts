// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountProxies } from 'api/subscribe/accountProxies'
import type { ActivePoolAccount } from 'api/subscribe/activePoolAccount'
import type { Bonded } from 'api/subscribe/bonded'
import type { PoolMembers } from 'api/subscribe/poolMembers'

// Define all possible subscription classes
export type Subscription =
  | AccountProxies
  | ActivePoolAccount
  | Bonded
  | PoolMembers

// the record of keyed subscriptions
export type ChainSubscriptions = Record<string, Subscription>

// Abstract class that ensures all subscription classes have an unsubscribe method
export abstract class Unsubscribable {
  abstract unsubscribe: () => void
}
