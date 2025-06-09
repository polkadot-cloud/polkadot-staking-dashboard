// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { Locale } from 'date-fns'
import type { NominatorReward, PoolReward } from 'plugin-staking-api/types'

export interface PieProps {
  color1?: string
  color2?: string
}

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
  labels: {
    payout: string
    dayAverage: string
  }
}

export interface GraphPayoutData {
  payouts: NominatorReward[]
  unclaimedPayouts: NominatorReward[]
  poolClaims: PoolReward[]
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
