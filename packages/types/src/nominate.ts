// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type BondFor = 'pool' | 'nominator'

export interface Nominations {
  targets: Targets
  submittedIn: string | number
}

export type Targets = string[]
