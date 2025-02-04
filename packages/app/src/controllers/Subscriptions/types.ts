// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountBalances } from 'api/subscribe/accountBalances'
import type { AccountProxies } from 'api/subscribe/accountProxies'
import type { ActiveEra } from 'api/subscribe/activeEra'
import type { ActivePoolAccount } from 'api/subscribe/activePoolAccount'
import type { BlockNumber } from 'api/subscribe/blockNumber'
import type { Bonded } from 'api/subscribe/bonded'
import type { ErasRewardPoints } from 'api/subscribe/erasRewardPoints'
import type { FastUnstakeConfig } from 'api/subscribe/fastUnstakeConfig'
import type { FastUnstakeQueue } from 'api/subscribe/fastUnstakeQueue'
import type { NetworkMetrics } from 'api/subscribe/networkMetrics'
import type { PoolMembers } from 'api/subscribe/poolMembers'
import type { PoolsConfig } from 'api/subscribe/poolsConfig'
import type { StakingMetrics } from 'api/subscribe/stakingMetrics'

// Define all possible subscription classes
export type Subscription =
  | AccountBalances
  | AccountProxies
  | ActiveEra
  | ActivePoolAccount
  | BlockNumber
  | Bonded
  | ErasRewardPoints
  | FastUnstakeConfig
  | FastUnstakeQueue
  | NetworkMetrics
  | PoolsConfig
  | PoolMembers
  | StakingMetrics

// the record of keyed subscriptions
export type ChainSubscriptions = Record<string, Subscription>

// Abstract class that ensures all subscription classes have an unsubscribe method
export abstract class Unsubscribable {
  abstract unsubscribe: () => void
}
