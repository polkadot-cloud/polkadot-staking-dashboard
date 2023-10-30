// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { bnToU8a, u8aConcat } from '@polkadot/util';
import { rmCommas, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import React, { useRef, useState } from 'react';
import { EmptyH256, ModPrefix, U32Opts } from 'consts';
import type {
  PoolConfigState,
  PoolsConfigContextState,
} from 'contexts/Pools/types';
import type { AnyApi } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useApi } from '../../Api';
import * as defaults from './defaults';

export const PoolsConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useNetwork();
  const { api, isReady, consts } = useApi();
  const { poolsPalletId } = consts;

  // store pool metadata
  const [poolsConfig, setPoolsConfig] = useState<PoolConfigState>({
    stats: defaults.stats,
    unsub: null,
  });
  const poolsConfigRef = useRef(poolsConfig);

  // get favorite pools from local storage.
  const getLocalFavorites = () => {
    const localFavorites = localStorage.getItem(`${network}_favorite_pools`);
    return localFavorites !== null ? JSON.parse(localFavorites) : [];
  };

  // stores the user's favorite pools
  const [favorites, setFavorites] = useState<string[]>(getLocalFavorites());

  useEffectIgnoreInitial(() => {
    if (isReady) {
      subscribeToPoolConfig();
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady]);

  const unsubscribe = () => {
    if (poolsConfigRef.current.unsub !== null) {
      poolsConfigRef.current.unsub();
    }
  };

  // subscribe to pool chain state
  const subscribeToPoolConfig = async () => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [
        api.query.nominationPools.counterForPoolMembers,
        api.query.nominationPools.counterForBondedPools,
        api.query.nominationPools.counterForRewardPools,
        api.query.nominationPools.lastPoolId,
        api.query.nominationPools.maxPoolMembers,
        api.query.nominationPools.maxPoolMembersPerPool,
        api.query.nominationPools.maxPools,
        api.query.nominationPools.minCreateBond,
        api.query.nominationPools.minJoinBond,
        api.query.nominationPools.globalMaxCommission,
      ],
      ([
        counterForPoolMembers,
        counterForBondedPools,
        counterForRewardPools,
        lastPoolId,
        maxPoolMembers,
        maxPoolMembersPerPool,
        maxPools,
        minCreateBond,
        minJoinBond,
        globalMaxCommission,
      ]) => {
        // format optional configs to BigNumber or null
        maxPoolMembers = maxPoolMembers.toHuman();
        if (maxPoolMembers !== null) {
          maxPoolMembers = new BigNumber(rmCommas(maxPoolMembers));
        }
        maxPoolMembersPerPool = maxPoolMembersPerPool.toHuman();
        if (maxPoolMembersPerPool !== null) {
          maxPoolMembersPerPool = new BigNumber(
            rmCommas(maxPoolMembersPerPool)
          );
        }
        maxPools = maxPools.toHuman();
        if (maxPools !== null) {
          maxPools = new BigNumber(rmCommas(maxPools));
        }

        setStateWithRef(
          {
            ...poolsConfigRef.current,
            stats: {
              counterForPoolMembers: new BigNumber(
                counterForPoolMembers.toString()
              ),
              counterForBondedPools: new BigNumber(
                counterForBondedPools.toString()
              ),
              counterForRewardPools: new BigNumber(
                counterForRewardPools.toString()
              ),
              lastPoolId: new BigNumber(lastPoolId.toString()),
              maxPoolMembers,
              maxPoolMembersPerPool,
              maxPools,
              minCreateBond: new BigNumber(minCreateBond.toString()),
              minJoinBond: new BigNumber(minJoinBond.toString()),
              globalMaxCommission: Number(
                globalMaxCommission.toHuman().slice(0, -1)
              ),
            },
          },
          setPoolsConfig,
          poolsConfigRef
        );
      }
    );

    setStateWithRef(
      {
        ...poolsConfigRef.current,
        unsub,
      },
      setPoolsConfig,
      poolsConfigRef
    );
  };

  /*
   * Adds a favorite validator.
   */
  const addFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites);
    if (!newFavorites.includes(address)) newFavorites.push(address);

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
    if (!api) return '';
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
        stats: poolsConfigRef.current.stats,
      }}
    >
      {children}
    </PoolsConfigContext.Provider>
  );
};

export const PoolsConfigContext = React.createContext<PoolsConfigContextState>(
  defaults.defaultPoolsConfigContext
);

export const usePoolsConfig = () => React.useContext(PoolsConfigContext);
