// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { PoolsConfigContextState } from './types';
import { useNetwork } from 'contexts/Network';
import { defaultPoolsConfigContext } from './defaults';

export const PoolsConfigContext = createContext<PoolsConfigContextState>(
  defaultPoolsConfigContext
);

export const usePoolsConfig = () => useContext(PoolsConfigContext);

export const PoolsConfigProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();

  // get favorite pools from local storage.
  const getLocalFavorites = () => {
    const localFavorites = localStorage.getItem(`${network}_favorite_pools`);
    return localFavorites !== null ? JSON.parse(localFavorites) : [];
  };

  // stores the user's favorite pools
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

  /*
   * Removes a favorite validator if they exist.
   */
  const removeFavorite = (address: string) => {
    let newFavorites = Object.assign(favorites);
    newFavorites = newFavorites.filter(
      (validator: string) => validator !== address
    );
    localStorage.setItem(
      `${network}_favorite_pools`,
      JSON.stringify(newFavorites)
    );
    setFavorites([...newFavorites]);
  };

  return (
    <PoolsConfigContext.Provider
      value={{
        addFavorite,
        removeFavorite,
        favorites,
      }}
    >
      {children}
    </PoolsConfigContext.Provider>
  );
};
