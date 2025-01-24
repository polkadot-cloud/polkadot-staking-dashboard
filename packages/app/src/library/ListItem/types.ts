// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { ValidatorPrefs, ValidatorStatus } from 'contexts/Validators/types'
import type { NominationStatus } from 'library/ValidatorList/ValidatorItem/types'
import type { ReactNode } from 'react'
import type { BondedPool, BondFor, MaybeAddress } from 'types'

export interface Outline {
  outline?: boolean
}
export type CopyAddressProps = Outline & {
  address: string
}

export type FavoriteProps = Outline & {
  address: string
}

export type MetricsProps = Outline & {
  display: ReactNode | null
  address: string
}

export type MoreProps = Outline & {
  pool: BondedPool
  setActiveTab: (t: number) => void
  disabled: boolean
  outline?: boolean
}
export interface BlockedProps {
  prefs: ValidatorPrefs
}

export interface IdentityProps {
  address: string
}

export interface PoolIdentityProps {
  pool: BondedPool
}

export interface NominationStatusProps {
  address: string
  bondFor: BondFor
  nominator: MaybeAddress
  status?: NominationStatus
  noMargin?: boolean
}

export interface SelectProps {
  item: {
    address: string
  }
}

export interface ParaValidatorProps {
  address: MaybeAddress
}

export interface EraStatusProps {
  address: MaybeAddress
  noMargin: boolean
  totalStake: BigNumber
  status: ValidatorStatus
}
