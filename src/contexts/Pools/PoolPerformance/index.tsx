// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { MaxEraRewardPointsEras } from 'consts';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import Worker from 'workers/poolPerformance?worker';
import { useNetwork } from 'contexts/Network';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useApi } from 'contexts/Api';
import BigNumber from 'bignumber.js';
import { mergeDeep } from '@w3ux/utils';
import { useStaking } from 'contexts/Staking';
import { formatRawExposures } from 'contexts/Staking/Utils';
import type {
  PoolPerformanceContextInterface,
  PoolPerformanceFetched,
  PoolRewardPoints,
  PoolRewardPointsBatch,
  PoolRewardPointsBatchKey,
} from './types';
import { defaultPoolPerformanceContext } from './defaults';
import type { Sync } from 'types';

const worker = new Worker();

export const PoolPerformanceContext =
  createContext<PoolPerformanceContextInterface>(defaultPoolPerformanceContext);

export const usePoolPerformance = () => useContext(PoolPerformanceContext);

export const PoolPerformanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { network } = useNetwork();
  const { bondedPools } = useBondedPools();
  const { getPagedErasStakers } = useStaking();
  const { api, activeEra, isPagedRewardsActive } = useApi();
  const { erasRewardPointsFetched, erasRewardPoints } = useValidators();

  // Store whether pool performance data is being fetched under a given key.
  const performanceFetched = useRef<PoolPerformanceFetched>({});

  // Gets whether pool performance data is being fetched under a given key.
  const getPerformanceFetchedKey = (key: PoolRewardPointsBatchKey) =>
    performanceFetched.current[key] || false;

  // Sets whether pool performance data is being fetched under a given key.
  const setPerformanceFetchedKey = (
    key: PoolRewardPointsBatchKey,
    fetched: boolean
  ) => {
    performanceFetched.current = {
      ...performanceFetched.current,
      [key]: fetched,
    };
  };

  // Store whether pool performance data is being fetched.
  const [poolRewardPointsFetched, setPoolRewardPointsFetched] =
    useState<Sync>('unsynced');

  // Store pool performance data.
  const [poolRewardPoints, setPoolRewardPointsState] =
    useState<PoolRewardPointsBatch>({});

  // Gets a batch of pool reward points, or returns an empty object otherwise.
  const getPoolRewardPoints = (key: PoolRewardPointsBatchKey) =>
    poolRewardPoints[key] || {};

  // Sets a batch of pool reward points.
  const setPoolRewardPoints = (
    key: PoolRewardPointsBatchKey,
    batch: PoolRewardPoints
  ) => {
    setPoolRewardPointsState({
      ...poolRewardPoints,
      [key]: batch,
    });
  };

  // Store the currently active era being processed for pool performance.
  const [currentEra, setCurrentEra] = useState<BigNumber>(new BigNumber(0));

  // Store the earliest era that should be processed.
  const [finishEra, setFinishEra] = useState<BigNumber>(new BigNumber(0));

  // Handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data } = message;
      const { task } = data;
      if (task !== 'processNominationPoolsRewardData') {
        return;
      }

      // Update state with new data.
      const { poolRewardData } = data;
      setPoolRewardPoints(
        'pool_list',
        mergeDeep(poolRewardPoints, poolRewardData)
      );

      if (currentEra.isEqualTo(finishEra)) {
        setPoolRewardPointsFetched('synced');
      } else {
        const nextEra = BigNumber.max(currentEra.minus(1), 1);
        processEra(nextEra);
      }
    }
  };

  // Start fetching pool performance calls from the current era.
  const startGetPoolPerformance = async () => {
    setPoolRewardPointsFetched('syncing');
    setFinishEra(
      BigNumber.max(activeEra.index.minus(MaxEraRewardPointsEras), 1)
    );
    const startEra = BigNumber.max(activeEra.index.minus(1), 1);
    processEra(startEra);
  };

  // Get era data and send to worker.
  const processEra = async (era: BigNumber) => {
    if (!api) {
      return;
    }
    setCurrentEra(era);

    let exposures;
    if (isPagedRewardsActive(era)) {
      exposures = await getPagedErasStakers(era.toString());
    } else {
      // DEPRECATION: Paged Rewards
      //
      // Use deprecated `erasStakersClipped` if paged rewards not active for this era.
      const result = await api.query.staking.erasStakersClipped.entries(
        era.toString()
      );
      exposures = formatRawExposures(result);
    }

    worker.postMessage({
      task: 'processNominationPoolsRewardData',
      era: era.toString(),
      exposures,
      bondedPools: bondedPools.map(({ addresses }) => addresses.stash),
      erasRewardPoints,
    });
  };

  // Trigger worker to calculate pool reward data for garaphs once:
  //
  // - active era is synced.
  // - era reward points are fetched.
  // -  bonded pools have been fetched.
  //
  // Re-calculates when any of the above change.
  useEffectIgnoreInitial(() => {
    if (
      api &&
      bondedPools.length &&
      activeEra.index.isGreaterThan(0) &&
      erasRewardPointsFetched === 'synced' &&
      poolRewardPointsFetched === 'unsynced'
    ) {
      startGetPoolPerformance();
    }
  }, [
    bondedPools,
    activeEra,
    erasRewardPointsFetched,
    poolRewardPointsFetched,
  ]);

  // Reset state data on network change.
  useEffectIgnoreInitial(() => {
    setPoolRewardPoints('pool_list', {});
    setCurrentEra(new BigNumber(0));
    setFinishEra(new BigNumber(0));
    setPoolRewardPointsFetched('unsynced');
  }, [network]);

  return (
    <PoolPerformanceContext.Provider
      value={{
        poolRewardPointsFetched,
        getPoolRewardPoints,
        getPerformanceFetchedKey,
        setPerformanceFetchedKey,
      }}
    >
      {children}
    </PoolPerformanceContext.Provider>
  );
};
