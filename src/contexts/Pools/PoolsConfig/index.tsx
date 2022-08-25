// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { bnToU8a, u8aConcat } from '@polkadot/util';
import { EMPTY_H256, MOD_PREFIX, U32_OPTS } from 'consts';
import React, { useState, useEffect, useRef } from 'react';
import { PoolConfigState, PoolsConfigContextState } from 'contexts/Pools/types';
import { AnyApi } from 'types';
import { rmCommas, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import { useApi } from '../../Api';

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
  const { features } = network;

  // whether pools are enabled
  const [enabled, setEnabled] = useState(0);

  // store pool metadata
  const [poolsConfig, setPoolsConfig] = useState<PoolConfigState>({
    stats: defaults.stats,
    unsub: null,
  });
  const poolsConfigRef = useRef(poolsConfig);

  // get favourite pools from local storage
  const getFavourites = () => {
    const _favourites = localStorage.getItem(
      `${network.name.toLowerCase()}_favourite_pools`
    );
    return _favourites !== null ? JSON.parse(_favourites) : [];
  };

  // stores the user's favourite pools
  const [favourites, setFavourites] = useState<string[]>(getFavourites());

  // disable pools if network does not support them
  useEffect(() => {
    if (features.pools) {
      setEnabled(1);
    } else {
      setEnabled(0);
      unsubscribe();
    }
  }, [network]);

  useEffect(() => {
    if (isReady && enabled) {
      subscribeToPoolConfig();
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady, enabled]);

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
        _maxPoolMembers,
        _maxPoolMembersPerPool,
        _maxPools,
        _minCreateBond,
        _minJoinBond,
      ]) => {
        // format optional configs to BN or null
        _maxPoolMembers = _maxPoolMembers.toHuman();
        if (_maxPoolMembers !== null) {
          _maxPoolMembers = new BN(rmCommas(_maxPoolMembers));
        }
        _maxPoolMembersPerPool = _maxPoolMembersPerPool.toHuman();
        if (_maxPoolMembersPerPool !== null) {
          _maxPoolMembersPerPool = new BN(rmCommas(_maxPoolMembersPerPool));
        }
        _maxPools = _maxPools.toHuman();
        if (_maxPools !== null) {
          _maxPools = new BN(rmCommas(_maxPools));
        }

        setStateWithRef(
          {
            ...poolsConfigRef.current,
            stats: {
              counterForPoolMembers: _counterForPoolMembers.toBn(),
              counterForBondedPools: _counterForBondedPools.toBn(),
              counterForRewardPools: _counterForRewardPools.toBn(),
              maxPoolMembers: _maxPoolMembers,
              maxPoolMembersPerPool: _maxPoolMembersPerPool,
              maxPools: _maxPools,
              minCreateBond: _minCreateBond.toBn(),
              minJoinBond: _minJoinBond.toBn(),
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
   * Adds a favourite validator.
   */
  const addFavourite = (address: string) => {
    const _favourites: any = Object.assign(favourites);
    if (!_favourites.includes(address)) {
      _favourites.push(address);
    }

    localStorage.setItem(
      `${network.name.toLowerCase()}_favourite_pools`,
      JSON.stringify(_favourites)
    );
    setFavourites([..._favourites]);
  };

  /*
   * Removes a favourite validator if they exist.
   */
  const removeFavourite = (address: string) => {
    let _favourites = Object.assign(favourites);
    _favourites = _favourites.filter(
      (validator: string) => validator !== address
    );
    localStorage.setItem(
      `${network.name.toLowerCase()}_favourite_pools`,
      JSON.stringify(_favourites)
    );
    setFavourites([..._favourites]);
  };

  // Helper: generates pool stash and reward accounts. assumes poolsPalletId is synced.
  const createAccounts = (poolId: number) => {
    const poolIdBN = new BN(poolId);
    return {
      stash: createAccount(poolIdBN, 0),
      reward: createAccount(poolIdBN, 1),
    };
  };

  const createAccount = (poolId: BN, index: number): string => {
    if (!api) return '';
    return api.registry
      .createType(
        'AccountId32',
        u8aConcat(
          MOD_PREFIX,
          poolsPalletId,
          new Uint8Array([index]),
          bnToU8a(poolId, U32_OPTS),
          EMPTY_H256
        )
      )
      .toString();
  };

  return (
    <PoolsConfigContext.Provider
      value={{
        enabled,
        addFavourite,
        removeFavourite,
        createAccounts,
        favourites,
        stats: poolsConfigRef.current.stats,
      }}
    >
      {children}
    </PoolsConfigContext.Provider>
  );
};
