// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from '@w3ux/types'
import type { UnclaimedRewards } from 'plugin-staking-api/src/types'

export interface PayoutsContextInterface {
  payoutsSynced: Sync
  unclaimedRewards: UnclaimedRewards
  setUnclaimedRewards: (unclaimedRewards: UnclaimedRewards) => void
}

// Record<era, EraUnclaimedPayouts>
export type UnclaimedPayouts = Record<string, EraUnclaimedPayouts> | null

// Record<validator, [page, amount]>
export type EraUnclaimedPayouts = Record<string, [number, string]>

export interface LocalValidatorExposure {
  staked: string
  total: string
  share: string
  isValidator: boolean
  exposedPage: number
}
