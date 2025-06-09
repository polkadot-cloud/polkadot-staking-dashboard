// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { Locale } from 'date-fns'
import type {
  NominatorReward,
  PoolReward,
  ValidatorEraPoints,
} from 'plugin-staking-api/types'

// Base props shared across graph components
export interface BaseGraphProps {
  getThemeValue: (key: string) => string
  dateFormat?: Locale
}

// Props for components that need unit formatting
export interface UnitFormattingProps {
  unit: string
  units: number
}

// Dimensions props
export interface GraphDimensionsProps {
  width?: string | number
  height?: string | number
}

export interface PieProps {
  color1?: string
  color2?: string
}

export interface EraPointsLineProps
  extends BaseGraphProps,
    GraphDimensionsProps {
  entries: ValidatorEraPoints[]
  syncing: boolean
  labels: {
    date: string
    era: string
    eraPoints: string
  }
}

export interface PayoutBarProps extends BaseGraphProps, UnitFormattingProps {
  days: number
  height: string
  data: GraphPayoutData
  nominating: boolean
  inPool: boolean
  syncing: boolean
  labels: {
    payout: string
    poolClaim: string
    unclaimedPayouts: string
    pending: string
  }
}

export interface PayoutLineProps
  extends BaseGraphProps,
    UnitFormattingProps,
    GraphDimensionsProps {
  entries: PayoutLineEntry[]
  syncing: boolean
  labels: {
    era: string
    reward: string
    payouts: string
  }
}

export interface PayoutLineEntry {
  era: number
  reward: string
  start: number
}

export interface AveragePayoutLineProps
  extends BaseGraphProps,
    UnitFormattingProps {
  days: number
  average: number
  height: string
  background?: string
  data: GraphPayoutData
  nominating: boolean
  inPool: boolean
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

export interface GeoDonutProps extends BaseGraphProps {
  title: string
  series: {
    labels: string[]
    data: number[]
  }
  width?: string | number
  maxHeight?: string | number
  legendHeight?: number
  maxLabelLen?: number
}

export interface PayoutDayCursor {
  reward: BigNumber
}

// Internal type for reward processing
export interface RewardRecord {
  reward: string
  timestamp: number
}
