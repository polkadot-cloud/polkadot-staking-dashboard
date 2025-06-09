// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'

// Graph-specific interfaces that were previously in library/Graphs/types.ts
import type { Locale } from 'date-fns'

export interface BondedProps {
  active: BigNumber
  free: BigNumber
  unlocking: BigNumber
  unlocked: BigNumber
  inactive: boolean
}

export interface PayoutBarProps {
  days: number
  height: string
  data: GraphPayoutData
  nominating: boolean
  inPool: boolean
  syncing: boolean
  // Theme and translation props
  getThemeValue: (key: string) => string
  unit: string
  units: number
  t: (key: string) => string
  i18n: { resolvedLanguage?: string }
  locales: Record<string, { dateFormat: Locale }>
  defaultLocale: string
}

export interface AveragePayoutLineProps {
  days: number
  average: number
  height: string
  background?: string
  data: GraphPayoutData
  nominating: boolean
  inPool: boolean
  // Theme and translation props
  getThemeValue: (key: string) => string
  unit: string
  units: number
  t: (key: string) => string
}

export interface GraphPayoutData {
  payouts: NominatorReward[]
  unclaimedPayouts: NominatorReward[]
  poolClaims: PoolReward[]
}

export interface CardWrapperProps {
  height?: string | number
}

export interface PayoutDayCursor {
  reward: BigNumber
}

export interface GeoDonutProps {
  title: string
  series: {
    labels: string[]
    data: number[]
  }
  width?: string | number
  maxHeight?: string | number
  legendHeight?: number
  maxLabelLen?: number
  // Theme props
  getThemeValue: (key: string) => string
}

export interface PayoutLineEntry {
  era: number
  reward: string
  start: number
}

// Simplified reward types for graph usage (avoiding plugin-staking-api dependency)
export interface NominatorReward {
  era: number
  reward: string
  claimed: boolean
  timestamp: number
  validator: string
  type: string
}

export interface PoolReward {
  who: string
  poolId: number
  reward: string
  timestamp: number
}

export type RewardResult = NominatorReward | PoolReward
export type RewardResults = RewardResult[]
