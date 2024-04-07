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
import { rmCommas, shuffle } from '@w3ux/utils';
import BigNumber from 'bignumber.js';

export const JoinPoolsContext = createContext<JoinPoolsContextInterface>(
  defaultJoinPoolsContext
);

export const useJoinPools = () => useContext(JoinPoolsContext);

export const JoinPoolsProvider = ({ children }: { children: ReactNode }) => {
  const {
    api,
    activeEra,
    networkMetrics: { minimumActiveStake },
  } = useApi();
  const { bondedPools } = useBondedPools();
  const { erasRewardPointsFetched } = useValidators();
  const { getPoolPerformanceTask, startPoolRewardPointsFetch } =
    usePoolPerformance();

  // Save the bonded pools subset for pool joining.
  const [poolsForJoin, setPoolsToJoin] = useState<BondedPool[]>([]);

  // Start finding pools to join.
  const startJoinPoolFetch = () => {
    startPoolRewardPointsFetch(
      'pool_join',
      poolsForJoin.map(({ addresses }) => addresses.stash)
    );
  };

  // Trigger worker to calculate join pool performance data.
  useEffectIgnoreInitial(() => {
    if (
      api &&
      bondedPools.length &&
      activeEra.index.isGreaterThan(0) &&
      erasRewardPointsFetched === 'synced' &&
      getPoolPerformanceTask('pool_join')?.status === 'unsynced'
    ) {
      // Generate a subset of pools to fetch performance data for. Start by only considering active pools.
      const activeBondedPools = bondedPools.filter(
        ({ state }) => state === 'Open'
      );

      // Filter pools that do not have at least double the minimum stake to earn rewards, in points.
      // NOTE: assumes that points are a 1:1 ratio between balance and points.
      const rewardBondedPools = activeBondedPools.filter(({ points }) => {
        const pointsBn = new BigNumber(rmCommas(points));
        const threshold = minimumActiveStake.multipliedBy(2);
        return pointsBn.isGreaterThanOrEqualTo(threshold);
      });

      // Order active bonded pools by member count.
      const sortedBondedPools = rewardBondedPools.sort(
        (a, b) =>
          Number(rmCommas(a.memberCounter)) - Number(rmCommas(b.memberCounter))
      );

      // Take lower third of sorted bonded pools to join.
      const lowerThirdBondedPools = sortedBondedPools.slice(
        0,
        Math.floor(sortedBondedPools.length / 3)
      );

      // Shuffle the lower third of bonded pools to join, and select a random subset of them.
      const poolJoinSelection = shuffle(lowerThirdBondedPools).slice(
        0,
        MaxPoolsForJoin
      );

      // Commit final pool selection to state.
      setPoolsToJoin(poolJoinSelection);
    }
  }, [
    bondedPools,
    activeEra,
    erasRewardPointsFetched,
    getPoolPerformanceTask('pool_join'),
  ]);

  return (
    <JoinPoolsContext.Provider value={{ poolsForJoin, startJoinPoolFetch }}>
      {children}
    </JoinPoolsContext.Provider>
  );
};
