// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { NetworkId } from 'common-types'
import type {
  EraRewardPoints,
  LocalValidatorEntriesData,
  Validator,
} from 'contexts/Validators/types'

// Get favorite validators from local storage
export const getLocalFavorites = (network: NetworkId) => {
  const localFavourites = localStorage.getItem(`${network}_favorites`)
  return localFavourites !== null
    ? (JSON.parse(localFavourites) as string[])
    : []
}

// Get local validator entries data for an era
export const getLocalEraValidators = (network: NetworkId, era: string) => {
  const data = localStorage.getItem(`${network}_validators`)
  const current = data ? (JSON.parse(data) as LocalValidatorEntriesData) : null
  const currentEra = current?.era

  if (currentEra && currentEra !== era) {
    localStorage.removeItem(`${network}_validators`)
  }

  return currentEra === era ? current : null
}

// Set local validator entries data for an era
export const setLocalEraValidators = (
  network: NetworkId,
  era: string,
  entries: Validator[],
  avgCommission: number
) => {
  localStorage.setItem(
    `${network}_validators`,
    JSON.stringify({
      era,
      entries,
      avgCommission,
    })
  )
}

// Check if era reward points entry exists for an era
export const hasLocalEraRewardPoints = (network: NetworkId, era: string) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_reward_points`) || '{}'
  )
  return !!current?.[era]
}

// Get local era reward points entry for an era
export const getLocalEraRewardPoints = (network: NetworkId, era: string) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_reward_points`) || '{}'
  )
  return current?.[era] || {}
}

// Set local era reward points entry for an era
export const setLocalEraRewardPoints = (
  network: NetworkId,
  era: string,
  eraRewardPoints: EraRewardPoints | null,
  endEra: string
) => {
  const current = JSON.parse(
    localStorage.getItem(`${network}_era_reward_points`) || '{}'
  )

  const removeStaleEras = Object.fromEntries(
    Object.entries(current || {}).filter(([k]: [string, unknown]) =>
      new BigNumber(k).isGreaterThanOrEqualTo(endEra)
    )
  )

  localStorage.setItem(
    `${network}_era_reward_points`,
    JSON.stringify({
      ...removeStaleEras,
      [era]: eraRewardPoints,
    })
  )
}
