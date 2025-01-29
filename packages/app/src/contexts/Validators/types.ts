// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, Sync } from '@w3ux/types'
import type BigNumber from 'bignumber.js'
import type { ActiveValidatorRank } from 'plugin-staking-api/types'
import type { Identity } from 'types'

export interface ValidatorsContextInterface {
  fetchValidatorPrefs: (a: ValidatorAddresses) => Promise<Validator[] | null>
  getValidatorPointsFromEras: (
    startEra: BigNumber,
    address: string
  ) => Record<string, BigNumber>
  injectValidatorListData: (entries: Validator[]) => ValidatorListEntry[]
  getValidators: () => Validator[]
  validatorIdentities: Record<string, Identity>
  validatorSupers: Record<string, AnyJson>
  avgCommission: number
  sessionValidators: string[]
  sessionParaValidators: string[]
  erasRewardPoints: ErasRewardPoints
  validatorsFetched: Sync
  validatorEraPointsHistory: Record<string, ValidatorEraPointHistory>
  averageEraValidatorReward: AverageEraValidatorReward
  formatWithPrefs: (addresses: string[]) => Validator[]
  getValidatorTotalStake: (address: string) => bigint
  activeValidatorRanks: ActiveValidatorRank[]
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

export type ErasRewardPoints = Record<string, EraRewardPoints>

export interface EraRewardPoints {
  total: string
  individual: Record<string, string>
}

export type ValidatorListEntry = Validator & {
  validatorStatus: ValidatorStatus
}

export interface ValidatorEraPointHistory {
  eras: Record<string, BigNumber>
  totalPoints: BigNumber
  rank?: number
  quartile?: number
}

export interface LocalValidatorExposure {
  staked: string
  total: string
  share: string
  isValidator: boolean
  exposedPage: number
}
