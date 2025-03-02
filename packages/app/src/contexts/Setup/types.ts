// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, MaybeString } from '@w3ux/types'
import type { ValidatorPrefs } from 'contexts/Validators/types'
import type { BondFor, MaybeAddress, PoolRoles } from 'types'

export type PayeeOptions =
  | 'Staked'
  | 'Stash'
  | 'Controller'
  | 'Account'
  | 'None'

export type NominatorSetups = Record<string, NominatorSetup>

export interface NominatorSetup {
  section: number
  progress: NominatorProgress
}

export interface NominatorProgress {
  payee: PayeeConfig
  nominations: AnyJson[]
  bond: MaybeString
}

export interface PayeeConfig {
  destination: PayeeOptions | null
  account: MaybeAddress
}

export type PayeeSubmit =
  | {
      type: 'Account'
      value: string
    }
  | {
      type: 'Staked' | 'Stash' | 'Controller' | 'None'
      value?: undefined
    }

export type PoolSetups = Record<string, PoolSetup>

export interface PoolSetup {
  section: number
  progress: PoolProgress
}

export interface PoolProgress {
  metadata: string
  bond: string
  nominations: { address: string; prefs: ValidatorPrefs }[]
  roles: PoolRoles | null
}

export interface SetupContextInterface {
  removeSetupProgress: (t: BondFor, a: MaybeAddress) => void
  getNominatorSetupPercent: (a: MaybeAddress) => number
  getPoolSetupPercent: (a: MaybeAddress) => number
  setActiveAccountSetup: (
    t: BondFor,
    p: NominatorProgress | PoolProgress
  ) => void
  setActiveAccountSetupSection: (t: BondFor, s: number) => void
  getNominatorSetup: (address: MaybeAddress) => NominatorSetup
  getPoolSetup: (address: MaybeAddress) => PoolSetup
}
