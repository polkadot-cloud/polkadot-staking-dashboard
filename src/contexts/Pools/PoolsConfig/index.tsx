// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bnToU8a, u8aConcat } from '@polkadot/util';
import { rmCommas, setStateWithRef } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { EmptyH256, ModPrefix, U32Opts } from 'consts';
import type {
  PoolConfigState,
  PoolsConfigContextState,
} from 'contexts/Pools/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, AnyJson } from 'types';
import { useApi } from '../../Api';
import * as defaults from './defaults';

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

  // store global max commission.
  // NOTE: on Polkadot runtime upgrade this can be moved to `poolsConfig`.
  const [globalMaxCommission, setGlobalMaxCommission] = useState<AnyJson>(0);
  const globalMaxCommissionRef = useRef(globalMaxCommission);
  const unsub2 = useRef<AnyApi>();

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
      subscribeToGlobalMaxCommission();
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady]);

  const unsubscribe = () => {
    if (poolsConfigRef.current.unsub !== null) {
      poolsConfigRef.current.unsub();
    }
    if (unsub2.current) {
      unsub2.current();
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
        counterForPoolMembers,
        counterForBondedPools,
        counterForRewardPools,
        lastPoolId,
        maxPoolMembers,
        maxPoolMembersPerPool,
        maxPools,
        minCreateBond,
        minJoinBond,
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

  // subscribe to global max commission.
  const subscribeToGlobalMaxCommission = async () => {
    if (!api) return;

    const unsub = await api.query.nominationPools.globalMaxCommission(
      (result: AnyApi) => {
        // remove % and convert to number before store to state.
        setStateWithRef(
          Number(result.toHuman().slice(0, -1)),
          setGlobalMaxCommission,
          globalMaxCommissionRef
        );
      }
    );
    unsub2.current = unsub;
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
        globalMaxCommission: globalMaxCommissionRef.current,
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
