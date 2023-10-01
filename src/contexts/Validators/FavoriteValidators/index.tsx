// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import type { Validator, FavoriteValidatorsContextInterface } from '../types';
import { getLocalFavorites } from '../Utils';
import { defaultFavoriteValidatorsContext } from './defaults';
import { useValidators } from '../ValidatorEntries';

export const FavoriteValidatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady } = useApi();
  const {
    networkData: { name },
    network,
  } = useNetwork();
  const { fetchValidatorPrefs } = useValidators();

  // Stores the user's favorite validators.
  const [favorites, setFavorites] = useState<string[]>(getLocalFavorites(name));

  // Stores the user's favorites validators as list.
  const [favoritesList, setFavoritesList] = useState<Validator[] | null>(null);

  const fetchFavoriteList = async () => {
    // fetch preferences
    const favoritesWithPrefs = await fetchValidatorPrefs(
      [...favorites].map((address) => ({
        address,
      }))
    );
    setFavoritesList(favoritesWithPrefs || []);
  };

  // Adds a favorite validator.
  const addFavorite = (address: string) => {
    const newFavorites: any = Object.assign(favorites);
    if (!newFavorites.includes(address)) {
      newFavorites.push(address);
    }

    localStorage.setItem(`${network}_favorites`, JSON.stringify(newFavorites));
    setFavorites([...newFavorites]);
  };

  // Removes a favorite validator if they exist.
  const removeFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites).filter(
      (validator: string) => validator !== address
    );
    localStorage.setItem(`${network}_favorites`, JSON.stringify(newFavorites));
    setFavorites([...newFavorites]);
  };

  // Re-fetch favorites on network change
  useEffectIgnoreInitial(() => {
    setFavorites(getLocalFavorites(name));
  }, [network]);

  // Fetch favorites in validator list format
  useEffectIgnoreInitial(() => {
    if (isReady) {
      fetchFavoriteList();
    }
  }, [isReady, favorites]);

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
  );
};

export const FavoriteValidatorsContext =
  React.createContext<FavoriteValidatorsContextInterface>(
    defaultFavoriteValidatorsContext
  );

export const useFavoriteValidators = () =>
  React.useContext(FavoriteValidatorsContext);
