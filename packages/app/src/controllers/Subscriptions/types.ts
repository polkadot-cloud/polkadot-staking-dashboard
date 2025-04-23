// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountBalances } from 'api/subscribe/accountBalances'
import type { AccountProxies } from 'api/subscribe/accountProxies'
import type { ActivePoolAccount } from 'api/subscribe/activePoolAccount'
import type { Bonded } from 'api/subscribe/bonded'
import type { FastUnstakeConfig } from 'api/subscribe/fastUnstakeConfig'
import type { FastUnstakeQueue } from 'api/subscribe/fastUnstakeQueue'
import type { PoolMembers } from 'api/subscribe/poolMembers'

// Define all possible subscription classes
export type Subscription =
  | AccountBalances
  | AccountProxies
  | ActivePoolAccount
  | Bonded
  | FastUnstakeConfig
  | FastUnstakeQueue
  | PoolMembers

// the record of keyed subscriptions
export type ChainSubscriptions = Record<string, Subscription>

// Abstract class that ensures all subscription classes have an unsubscribe method
export abstract class Unsubscribable {
  abstract unsubscribe: () => void
}
