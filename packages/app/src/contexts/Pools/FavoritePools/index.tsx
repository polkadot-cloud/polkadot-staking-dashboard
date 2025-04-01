// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { FavoritePoolsContextState } from './types'

export const [FavoritePoolsContext, useFavoritePools] =
  createSafeContext<FavoritePoolsContextState>()

export const FavoritePoolsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { network } = useNetwork()

  // Get favorite pools from local storage
  const getLocalFavorites = () => {
    const localFavorites = localStorage.getItem(`${network}_favorite_pools`)
    return localFavorites !== null ? JSON.parse(localFavorites) : []
  }

  // Stores the user's favorite pools
  const [favorites, setFavorites] = useState<string[]>(getLocalFavorites())

  // Adds a favorite validator
  const addFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites)
    if (!newFavorites.includes(address)) {
      newFavorites.push(address)
    }

    localStorage.setItem(
      `${network}_favorite_pools`,
      JSON.stringify(newFavorites)
    )
    setFavorites([...newFavorites])
  }

  // Removes a favorite pool if they exist
  const removeFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites).filter(
      (validator: string) => validator !== address
    )
    localStorage.setItem(
      `${network}_favorite_pools`,
      JSON.stringify(newFavorites)
    )
    setFavorites([...newFavorites])
  }

  return (
    <FavoritePoolsContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritePoolsContext.Provider>
  )
}
