// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi } from 'common-types'
import type {
  NominatorReward,
  PoolReward,
  RewardResults,
} from 'plugin-staking-api/types'
import type { Dispatch, SetStateAction } from 'react'

export type PayoutHistoryProps = PageProps & {
  loading: boolean
  payoutGraphData: PayoutGraphData
}

export interface PayoutGraphData {
  payouts: NominatorReward[]
  unclaimedPayouts: NominatorReward[]
  poolClaims: PoolReward[]
}
export interface PageProps {
  payoutsList: RewardResults
  setPayoutsList: Dispatch<SetStateAction<RewardResults>>
}

export interface PayoutListProps {
  allowMoreCols?: boolean
  pagination?: boolean
  title?: string | null
  itemsPerPage: number
  payoutsList?: AnyApi
  payouts?: AnyApi
}

export interface CalculatorMetrics {
  currentStake: number
  averageRewardRate: number
  isInPool: boolean
  historicalRewards: {
    total: number
    totalUsdt: number
  }
}
