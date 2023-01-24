// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bnToU8a, u8aConcat } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { EmptyH256, ModPrefix, U32Opts } from 'consts';
import { PoolConfigState, PoolsConfigContextState } from 'contexts/Pools/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi } from 'types';
import { rmCommas, setStateWithRef } from 'Utils';
import { useApi } from '../../Api';
import * as defaults from './defaults';

export const PoolsConfigContext = React.createContext<PoolsConfigContextState>(
  defaults.defaultPoolsConfigContext
);

export const usePoolsConfig = () => React.useContext(PoolsConfigContext);

export const PoolsConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network, isReady, consts } = useApi();
  const { poolsPalletId } = consts;

  // store pool metadata
  const [poolsConfig, setPoolsConfig] = useState<PoolConfigState>({
    stats: defaults.stats,
    unsub: null,
  });
  const poolsConfigRef = useRef(poolsConfig);

  // get favorite pools from local storage.
  const getLocalFavorites = () => {
    const localFavorites = localStorage.getItem(
      `${network.name}_favorite_pools`
    );
    return localFavorites !== null ? JSON.parse(localFavorites) : [];
  };

  // stores the user's favorite pools
  const [favorites, setFavorites] = useState<string[]>(getLocalFavorites());

  useEffect(() => {
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
      ],
      ([
        _counterForPoolMembers,
        _counterForBondedPools,
        _counterForRewardPools,
        _lastPoolId,
        _maxPoolMembers,
        _maxPoolMembersPerPool,
        _maxPools,
        _minCreateBond,
        _minJoinBond,
      ]) => {
        // format optional configs to BigNumber or null
        _maxPoolMembers = _maxPoolMembers.toHuman();
        if (_maxPoolMembers !== null) {
          _maxPoolMembers = new BigNumber(rmCommas(_maxPoolMembers));
        }
        _maxPoolMembersPerPool = _maxPoolMembersPerPool.toHuman();
        if (_maxPoolMembersPerPool !== null) {
          _maxPoolMembersPerPool = new BigNumber(
            rmCommas(_maxPoolMembersPerPool)
          );
        }
        _maxPools = _maxPools.toHuman();
        if (_maxPools !== null) {
          _maxPools = new BigNumber(rmCommas(_maxPools));
        }

        setStateWithRef(
          {
            ...poolsConfigRef.current,
            stats: {
              counterForPoolMembers: new BigNumber(
                _counterForPoolMembers.toString()
              ),
              counterForBondedPools: new BigNumber(
                _counterForBondedPools.toString()
              ),
              counterForRewardPools: new BigNumber(
                _counterForRewardPools.toString()
              ),
              lastPoolId: new BigNumber(_lastPoolId.toString()),
              maxPoolMembers: _maxPoolMembers,
              maxPoolMembersPerPool: _maxPoolMembersPerPool,
              maxPools: _maxPools,
              minCreateBond: new BigNumber(_minCreateBond.toString()),
              minJoinBond: new BigNumber(_minJoinBond.toString()),
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
    const newFavorites: any = Object.assign(favorites);
    if (!newFavorites.includes(address)) {
      newFavorites.push(address);
    }

    localStorage.setItem(
      `${network.name}_favorite_pools`,
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
      `${network.name}_favorite_pools`,
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
