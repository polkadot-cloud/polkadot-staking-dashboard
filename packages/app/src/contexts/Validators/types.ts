// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, Sync } from '@w3ux/types'
import type BigNumber from 'bignumber.js'
import type { Identity } from 'types'

export interface ValidatorsContextInterface {
  fetchValidatorPrefs: (a: ValidatorAddresses) => Promise<Validator[] | null>
  injectValidatorListData: (entries: Validator[]) => ValidatorListEntry[]
  getValidators: () => Validator[]
  validatorIdentities: Record<string, Identity>
  validatorSupers: Record<string, AnyJson>
  avgCommission: number
  sessionValidators: string[]
  sessionParaValidators: string[]
  validatorsFetched: Sync
  averageEraValidatorReward: AverageEraValidatorReward
  formatWithPrefs: (addresses: string[]) => Validator[]
  getValidatorTotalStake: (address: string) => bigint
  getValidatorRank: (address: string) => number | undefined
  getValidatorRankSegment: (address: string) => number
}

export interface Validators {
  status: Sync
  validators: Validator[]
}

export type ValidatorStatus = 'waiting' | 'active'

export interface AverageEraValidatorReward {
  days: number
  reward: BigNumber
}

export interface FavoriteValidatorsContextInterface {
  addFavorite: (address: string) => void
  removeFavorite: (address: string) => void
  favorites: string[]
  favoritesList: Validator[] | null
}

export type ValidatorAddresses = {
  address: string
}[]

export interface Validator {
  address: string
  prefs: ValidatorPrefs
}

export interface ValidatorPrefs {
  commission: number
  blocked: boolean
}

export interface LocalValidatorEntriesData {
  avgCommission: number
  era: string
  entries: Validator[]
}

export type ValidatorListEntry = Validator & {
  validatorStatus: ValidatorStatus
}
