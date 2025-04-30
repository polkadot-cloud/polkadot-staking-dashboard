// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { EraRewardPoints } from 'types'
import { defaultEraRewardPoints } from './default'
import { _eraRewardPoints } from './private'

export const eraRewardPoints$ = _eraRewardPoints.asObservable()

export const resetEraRewardPoints = () => {
  _eraRewardPoints.next(defaultEraRewardPoints)
}

export const getEraRewardPoints = () => _eraRewardPoints.getValue()

export const setEraRewardPoints = (value: EraRewardPoints) => {
  _eraRewardPoints.next(value)
}

export const getValidatorEraPoints = (address: string) => {
  const addressEntry = getEraRewardPoints().individual.find(
    (item) => item[0] === address
  )
  return addressEntry?.[1] || 0
}

export const getValidatorRanks = () => {
  const sorted = getEraRewardPoints().individual.sort((a, b) => b[1] - a[1])
  return sorted.map(([validator], index) => ({
    validator,
    rank: index + 1,
  }))
}

export const getValidatorRank = (address: string) => {
  const ranked = getValidatorRanks()
  const rank = ranked.find((r) => r.validator === address)
  return rank?.rank || null
}

export * from './default'
