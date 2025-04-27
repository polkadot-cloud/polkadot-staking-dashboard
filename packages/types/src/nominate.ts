// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type BondFor = 'pool' | 'nominator'

export interface Nominations {
  targets: Targets
  submittedIn: number
}

export type Targets = string[]

export type NominationStatus = 'active' | 'inactive' | 'waiting'

export interface Nominator {
  targets: Targets
  submittedIn: number
  suppressed: boolean
}

export type NominatorsMultiQuery = (Nominator | undefined)[]
