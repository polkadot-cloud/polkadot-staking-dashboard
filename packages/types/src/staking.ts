// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  SpStakingExposurePage,
  SpStakingPagedExposureMetadata,
} from 'dedot/chaintypes'

export interface EraRewardPoints {
  total: number
  individual: Array<[string, number]>
}
export type ErasStakersOverviewEntries = [
  [number, string],
  SpStakingPagedExposureMetadata,
][]

export type ErasStakersPagedEntries = [
  [number, string, number],
  SpStakingExposurePage,
][]

export type RewardDestinaton =
  | 'Staked'
  | 'Stash'
  | 'Controller'
  | 'Account'
  | 'None'
