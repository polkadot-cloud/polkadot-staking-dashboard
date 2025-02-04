// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress, NominationStatus } from 'types'

export interface ActiveAccountOwnStake {
  address: string
  value: string
}
export interface EraStakers {
  activeAccountOwnStake: ActiveAccountOwnStake[]
  activeValidators: number
  stakers: Staker[]
  totalActiveNominators: number
}

export type NominationStatuses = Record<string, NominationStatus>

export interface Exposure {
  keys: string[]
  val: ExposureValue
}

export interface ExposureValue {
  others: ExposureOther[]
  own: string
  total: string
}

export type Staker = ExposureValue & {
  address: string
}

export interface ActiveAccountStaker {
  address: string
  value: string
}

export interface ExposureOther {
  who: string
  value: string
}

export interface StakingContextInterface {
  fetchEraStakers: (era: string) => Promise<Exposure[]>
  getNominationsStatusFromTargets: (
    w: MaybeAddress,
    t: string[]
  ) => Record<string, NominationStatus>
  getControllerNotImported: (a: MaybeAddress) => boolean
  addressDifferentToStash: (a: MaybeAddress) => boolean
  isBonding: () => boolean
  isNominating: () => boolean
  inSetup: () => boolean
  eraStakers: EraStakers
  getPagedErasStakers: (e: string) => Promise<Exposure[]>
}

export interface LocalExposuresData {
  era: string
  exposures: LocalExposure[]
}

export interface LocalExposure {
  k: [string, string]
  v: {
    o: [string, string]
    w: string
    t: string
  }
}
