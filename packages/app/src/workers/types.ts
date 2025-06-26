// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Exposure, Staker } from 'contexts/EraStakers/types'
import type { ActiveAccountStaker } from 'contexts/Staking/types'
import type { MaybeAddress, NetworkId } from 'types'

export interface ProcessExposuresArgs {
  task: string
  networkName: NetworkId
  era: string
  activeAccount: MaybeAddress
  units: number
  exposures: Exposure[]
}

export interface ProcessExposuresResponse {
  task: string
  networkName: NetworkId
  era: string
  stakers: Staker[]
  totalActiveNominators: number
  activeAccountOwnStake: ActiveAccountStaker[]
  who: MaybeAddress
}
