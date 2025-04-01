// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type ValidatorStatus = 'waiting' | 'active'

export interface Validator {
  address: string
  prefs: ValidatorPrefs
}

export interface ValidatorPrefs {
  commission: number
  blocked: boolean
}

export interface NominationSelection {
  nominations: Validator[]
}
