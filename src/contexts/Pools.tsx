// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';

export interface PoolsContextState {
  meta: any;
  status: any;
}

const defaultMeta = {
  counterForPoolMembers: 0,
  counterForBondedPools: 0,
  counterForRewardPools: 0,
  maxPoolMembers: 0,
  maxPoolMembersPerPool: 0,
  maxPools: 0,
  minCreateBond: 0,
  minJoinBond: 0,
};

const defaultStatus = {
  poolId: 0,
  points: '',
  rewardPoolTotalEarnings: 0,
  unbondingEras: {},
};

export const PoolsContext: React.Context<PoolsContextState> = React.createContext({
  meta: defaultMeta,
  status: defaultStatus,
});

export const usePools = () => React.useContext(PoolsContext);

export const PoolsProvider = (props: any) => {
  const [meta, setMeta] = useState(defaultMeta);
  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    setMeta({
      counterForPoolMembers: 2,
      counterForBondedPools: 1,
      counterForRewardPools: 1,
      maxPoolMembers: 512,
      maxPoolMembersPerPool: 32,
      maxPools: 0,
      minCreateBond: 1,
      minJoinBond: 1,
    });

    setStatus({
      poolId: 1,
      points: '100,000,000,000,000',
      rewardPoolTotalEarnings: 0,
      unbondingEras: {},
    });
  }, []);

  return (
    <PoolsContext.Provider value={{
      meta,
      status,
    }}
    >
      {props.children}
    </PoolsContext.Provider>
  );
};
