// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import * as defaults from './defaults';
import { useApi } from '../Api';
import { rmCommas } from '../../Utils';

export interface PoolsContextState {
  enabled: number;
  stats: any;
  activePool: any;
}

export const PoolsContext: React.Context<PoolsContextState> =
  React.createContext({
    enabled: 0,
    stats: defaults.stats,
    activePool: defaults.activePool,
  });

export const usePools = () => React.useContext(PoolsContext);

export const PoolsProvider = (props: any) => {
  const { api, network, isReady }: any = useApi();
  const { features } = network;

  // whether pools are enabled
  const [enabled, setEnabled] = useState(0);
  // store pool metadata
  const [poolsConfig, setPoolsConfig]: any = useState({
    stats: defaults.stats,
    unsub: null,
  });
  // store the account's active pool status
  const [activePool, setActivePool] = useState(defaults.activePool);

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
  }, [network, isReady]);

  const unsubscribe = async () => {
    if (poolsConfig.unsub !== null) {
      poolsConfig.unsub();
    }
  };

  // dummy data for active pool
  // TODO: replace with real data
  useEffect(() => {
    setActivePool({
      poolId: 1,
      points: '100,000,000,000,000',
      rewardPoolTotalEarnings: new BN(0),
      unbondingEras: {},
    });
  }, []);

  // subscribe to pool chain state
  const subscribeToPoolConfig = async () => {
    const unsub = await api.queryMulti(
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
      ]: any) => {
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

        setPoolsConfig({
          ...poolsConfig,
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
        });
      }
    );

    setPoolsConfig({
      ...poolsConfig,
      unsub,
    });
  };

  return (
    <PoolsContext.Provider
      value={{
        enabled,
        stats: poolsConfig.stats,
        activePool,
      }}
    >
      {props.children}
    </PoolsContext.Provider>
  );
};
