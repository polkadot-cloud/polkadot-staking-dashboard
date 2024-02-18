// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { FavoritePoolsContextState } from './types';
import { useNetwork } from 'contexts/Network';
import { defaultFavoritePoolsContext } from './defaults';

export const FavoritePoolsContext = createContext<FavoritePoolsContextState>(
  defaultFavoritePoolsContext
);

export const useFavoritePools = () => useContext(FavoritePoolsContext);

export const FavoritePoolsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { network } = useNetwork();

  // Get favorite pools from local storage.
  const getLocalFavorites = () => {
    const localFavorites = localStorage.getItem(`${network}_favorite_pools`);
    return localFavorites !== null ? JSON.parse(localFavorites) : [];
  };

  // Stores the user's favorite pools.
  const [favorites, setFavorites] = useState<string[]>(getLocalFavorites());

  // Adds a favorite validator.
  const addFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites);
    if (!newFavorites.includes(address)) {
      newFavorites.push(address);
    }

    localStorage.setItem(
      `${network}_favorite_pools`,
      JSON.stringify(newFavorites)
    );
    setFavorites([...newFavorites]);
  };

  // Removes a favorite pool if they exist.
  const removeFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites).filter(
      (validator: string) => validator !== address
    );
    localStorage.setItem(
      `${network}_favorite_pools`,
      JSON.stringify(newFavorites)
    );
    setFavorites([...newFavorites]);
  };

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
  );
};
