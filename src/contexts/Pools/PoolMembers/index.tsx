// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { PoolMemberContext } from 'contexts/Pools/types';
import { AnyApi } from 'types';
import { defaultPoolMembers } from './defaults';
import { useApi } from '../../Api';
import { usePoolsConfig } from '../PoolsConfig';

export const PoolMembersContext =
  React.createContext<PoolMemberContext>(defaultPoolMembers);

export const usePoolMembers = () => React.useContext(PoolMembersContext);

export const PoolMembersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network, isReady } = useApi();
  const { enabled } = usePoolsConfig();

  // store pool members
  const [poolMembers, setPoolMembers] = useState<Array<any>>([]);

  // clear existing state for network refresh
  useEffect(() => {
    setPoolMembers([]);
  }, [network]);

  // initial setup for fetching members
  useEffect(() => {
    if (isReady && enabled) {
      // fetch bonded pools
      fetchPoolMembers();
    }
  }, [network, isReady, enabled]);

  // fetch all pool members entries
  const fetchPoolMembers = async () => {
    if (!api) return;

    const _exposures = await api.query.nominationPools.poolMembers.entries();
    const exposures = _exposures.map(([_keys, _val]: AnyApi) => {
      const who = _keys.toHuman()[0];
      const membership = _val.toHuman();
      return {
        ...membership,
        who,
      };
    });

    setPoolMembers(exposures);
  };

  const getMembersOfPool = (poolId: number) => {
    const members = poolMembers.filter((p: any) => p.poolId === String(poolId));
    return members;
  };

  return (
    <PoolMembersContext.Provider
      value={{
        getMembersOfPool,
        poolMembers,
      }}
    >
      {children}
    </PoolMembersContext.Provider>
  );
};
