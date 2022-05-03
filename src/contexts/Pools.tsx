// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';

export interface PoolsContextState {
  meta: any;
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
}

export const PoolsContext: React.Context<PoolsContextState> = React.createContext({
  meta: defaultMeta,
});

export const usePools = () => React.useContext(PoolsContext);

export const PoolsProvider = (props: any) => {

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
    })
  }, []);

  const [meta, setMeta] = useState(defaultMeta);

  return (
    <PoolsContext.Provider value={{
      meta: meta,
    }}>
      {props.children}
    </PoolsContext.Provider>
  );
}