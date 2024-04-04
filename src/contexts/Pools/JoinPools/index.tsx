// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { JoinPoolsContextInterface } from './types';
import { MaxPoolsForJoin, defaultJoinPoolsContext } from './defaults';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useBondedPools } from '../BondedPools';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { usePoolPerformance } from '../PoolPerformance';
import type { BondedPool } from '../BondedPools/types';
import { shuffle } from '@w3ux/utils';

export const JoinPoolsContext = createContext<JoinPoolsContextInterface>(
  defaultJoinPoolsContext
);

export const useJoinPools = () => useContext(JoinPoolsContext);

export const JoinPoolsProvider = ({ children }: { children: ReactNode }) => {
  const { api, activeEra } = useApi();
  const { bondedPools } = useBondedPools();
  const { erasRewardPointsFetched } = useValidators();
  const { getPoolPerformanceTask, startPoolRewardPointsFetch } =
    usePoolPerformance();

  // Save the bonded pools subset for pool joining.
  const [poolsForJoin, setPoolsToJoin] = useState<BondedPool[]>([]);

  // Trigger worker to calculate join pool performance data.
  useEffectIgnoreInitial(() => {
    if (
      api &&
      bondedPools.length &&
      activeEra.index.isGreaterThan(0) &&
      erasRewardPointsFetched === 'synced' &&
      getPoolPerformanceTask('pool_join')?.status === 'unsynced'
    ) {
      // Generate a subset of pools to fetch performance data for. TODO: Send pools to JoinPool
      // canvas and only select those. Move this logic to a separate context.
      const poolJoinSelection = shuffle(
        bondedPools.filter(({ state }) => state === 'Open')
      ).slice(0, MaxPoolsForJoin);

      setPoolsToJoin(poolJoinSelection);

      startPoolRewardPointsFetch(
        'pool_join',
        poolJoinSelection.map(({ addresses }) => addresses.stash)
      );
    }
  }, [
    bondedPools,
    activeEra,
    erasRewardPointsFetched,
    getPoolPerformanceTask('pool_join'),
  ]);

  return (
    <JoinPoolsContext.Provider value={{ poolsForJoin }}>
      {children}
    </JoinPoolsContext.Provider>
  );
};
