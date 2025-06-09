// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { getRelayChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { Validator } from 'types'
import type { FavoriteValidatorsContextInterface } from '../types'
import { getLocalFavorites } from '../Utils'
import { useValidators } from '../ValidatorEntries'

export const [FavoriteValidatorsContext, useFavoriteValidators] =
  createSafeContext<FavoriteValidatorsContextInterface>()

export const FavoriteValidatorsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { isReady } = useApi()
  const { network } = useNetwork()
  const { fetchValidatorPrefs } = useValidators()
  const { name } = getRelayChainData(network)

  // Stores the user's favorite validators
  const [favorites, setFavorites] = useState<string[]>(getLocalFavorites(name))

  // Stores the user's favorites validators as list
  const [favoritesList, setFavoritesList] = useState<Validator[] | null>(null)

  const fetchFavoriteList = async () => {
    // Fetch preferences
    const favoritesWithPrefs = await fetchValidatorPrefs(
      [...favorites].map((address) => ({
        address,
      }))
    )
    setFavoritesList(favoritesWithPrefs || [])
  }

  // Adds a favorite validator
  const addFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites)
    if (!newFavorites.includes(address)) {
      newFavorites.push(address)
    }

    localStorage.setItem(`${network}_favorites`, JSON.stringify(newFavorites))
    setFavorites([...newFavorites])
  }

  // Removes a favorite validator if they exist
  const removeFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites).filter(
      (validator: string) => validator !== address
    )
    localStorage.setItem(`${network}_favorites`, JSON.stringify(newFavorites))
    setFavorites([...newFavorites])
  }

  // Re-fetch favorites on network change
  useEffectIgnoreInitial(() => {
    setFavorites(getLocalFavorites(name))
  }, [network])

  // Fetch favorites in validator list format
  useEffectIgnoreInitial(() => {
    if (isReady) {
      fetchFavoriteList()
    }
  }, [isReady, JSON.stringify(favorites)])

  return (
    <FavoriteValidatorsContext.Provider
      value={{
        addFavorite,
        removeFavorite,
        favorites,
        favoritesList,
      }}
    >
      {children}
    </FavoriteValidatorsContext.Provider>
  )
}
