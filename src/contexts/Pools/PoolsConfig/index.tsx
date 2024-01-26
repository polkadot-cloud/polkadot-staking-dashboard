// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { bnToU8a, u8aConcat } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { EmptyH256, ModPrefix, U32Opts } from 'consts';
import type { PoolsConfigContextState } from './types';
import { useNetwork } from 'contexts/Network';
import { useApi } from '../../Api';
import { defaultPoolsConfigContext } from './defaults';

export const PoolsConfigContext = createContext<PoolsConfigContextState>(
  defaultPoolsConfigContext
);

export const usePoolsConfig = () => useContext(PoolsConfigContext);

export const PoolsConfigProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { api, consts } = useApi();
  const { poolsPalletId } = consts;

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

  // Helper: generates pool stash and reward accounts. assumes poolsPalletId is synced.
  const createAccounts = (poolId: number) => {
    const poolIdBigNumber = new BigNumber(poolId);
    return {
      stash: createAccount(poolIdBigNumber, 0),
      reward: createAccount(poolIdBigNumber, 1),
    };
  };

  const createAccount = (poolId: BigNumber, index: number): string => {
    if (!api) {
      return '';
    }
    return api.registry
      .createType(
        'AccountId32',
        u8aConcat(
          ModPrefix,
          poolsPalletId,
          new Uint8Array([index]),
          bnToU8a(new BN(poolId.toString()), U32Opts),
          EmptyH256
        )
      )
      .toString();
  };

  return (
    <PoolsConfigContext.Provider
      value={{
        addFavorite,
        removeFavorite,
        createAccounts,
        favorites,
      }}
    >
      {children}
    </PoolsConfigContext.Provider>
  );
};
