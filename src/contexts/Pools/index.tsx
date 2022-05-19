// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import * as defaults from './defaults';
import { useApi } from '../Api';

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
  const { network }: any = useApi();
  const { features } = network;

  // whether pools are enabled
  const [enabled, setEnabled] = useState(0);
  // store pool metadata
  const [stats, setStats] = useState(defaults.stats);
  // store the account's active pool status
  const [activePool, setActivePool] = useState(defaults.activePool);

  // disable pools if network does not support them
  useEffect(() => {
    if (features.pools) {
      setEnabled(1);
    } else {
      setEnabled(0);
    }
  }, [network]);

  useEffect(() => {
    setStats({
      counterForPoolMembers: new BN(2),
      counterForBondedPools: new BN(1),
      counterForRewardPools: new BN(1),
      maxPoolMembers: new BN(512),
      maxPoolMembersPerPool: new BN(32),
      maxPools: new BN(0),
      minCreateBond: new BN(1),
      minJoinBond: new BN(1),
    });

    setActivePool({
      poolId: 1,
      points: '100,000,000,000,000',
      rewardPoolTotalEarnings: new BN(0),
      unbondingEras: {},
    });
  }, []);

  return (
    <PoolsContext.Provider
      value={{
        enabled,
        stats,
        activePool,
      }}
    >
      {props.children}
    </PoolsContext.Provider>
  );
};
