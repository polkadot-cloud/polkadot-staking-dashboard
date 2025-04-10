// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LocalValidatorEntriesData } from 'contexts/Validators/types'
import type { NetworkId, Validator } from 'types'

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
