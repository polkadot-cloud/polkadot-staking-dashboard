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
import { mergeDeep, setStateWithRef } from '@w3ux/utils';
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

  // Store whether pool performance data is being fetched under a given key. NOTE: Requires a ref to
  // be accessed in `processEra` before re-render.
  const [performanceFetched, setPerformanceFetched] =
    useState<PoolPerformanceFetched>({});
  const performanceFetchedRef = useRef(performanceFetched);

  // Store pool performance data. NOTE: Requires a ref to update state with current data.
  const [poolRewardPoints, setPoolRewardPointsState] =
    useState<PoolRewardPointsBatch>({});
  const poolRewardPointsRef = useRef(poolRewardPoints);

  // Gets a batch of pool reward points, or returns an empty object otherwise.
  const getPoolRewardPoints = (key: PoolRewardPointsBatchKey) =>
    poolRewardPoints?.[key] || {};

  // Store the currently active era being processed for pool performance.
  const [currentEra, setCurrentEra] = useState<BigNumber>(new BigNumber(0));

  // Store the earliest era that should be processed.
  const [finishEra, setFinishEra] = useState<BigNumber>(new BigNumber(0));

  // Sets a batch of pool reward points.
  const setPoolRewardPoints = (
    key: PoolRewardPointsBatchKey,
    batch: PoolRewardPoints
  ) => {
    const newRewardPoints = {
      ...poolRewardPointsRef.current,
      [key]: batch,
    };

    setStateWithRef(
      newRewardPoints,
      setPoolRewardPointsState,
      poolRewardPointsRef
    );
  };

  // Gets whether pool performance data is being fetched under a given key.
  const getPerformanceFetchedKey = (key: PoolRewardPointsBatchKey) =>
    performanceFetched[key] || { status: 'unsynced', addresses: [] };

  // Sets a pool performance fetching state under a given key.
  const setPerformanceFetchedKey = (
    key: PoolRewardPointsBatchKey,
    status: Sync,
    addresses: string[]
  ) => {
    setStateWithRef(
      {
        ...performanceFetched,
        [key]: { status, addresses },
      },
      setPerformanceFetched,
      performanceFetchedRef
    );

    // Reset pool reward points for the given key.
    if (status === 'unsynced') {
      setStateWithRef(
        {
          ...poolRewardPointsRef.current,
          [key]: {},
        },
        setPoolRewardPointsState,
        poolRewardPointsRef
      );
    }
  };

  // Updates an existing performance fetched key with a new status.
  const updatePerformanceFetchedKey = (
    key: PoolRewardPointsBatchKey,
    status: Sync
  ) => {
    if (!getPerformanceFetchedKey(key)) {
      return;
    }
    setStateWithRef(
      {
        ...performanceFetched,
        [key]: { ...performanceFetched[key], status },
      },
      setPerformanceFetched,
      performanceFetchedRef
    );
  };

  // Start fetching pool performance calls from the current era.
  const startGetPoolPerformance = async (
    key: PoolRewardPointsBatchKey,
    addresses: string[]
  ) => {
    // Set as synced and exit early if there are no addresses to process.
    if (!addresses.length) {
      setPerformanceFetchedKey(key, 'synced', addresses);
      return;
    }

    // If the addresses have not changed for this key, exit early.
    const current = getPerformanceFetchedKey(key);
    if (current.addresses.toString() === addresses.toString()) {
      return;
    }

    // Set as syncing and start processing.
    setPerformanceFetchedKey(key, 'syncing', addresses);

    // TODO: Needs to be a record for each list.
    setFinishEra(
      BigNumber.max(activeEra.index.minus(MaxEraRewardPointsEras), 1)
    );

    // Start processing from the previous active era.
    processEra(key, BigNumber.max(activeEra.index.minus(1), 1));
  };

  // Get era data and send to worker.
  const processEra = async (key: PoolRewardPointsBatchKey, era: BigNumber) => {
    if (!api) {
      return;
    }

    // TODO: Needs to be a record for each list.
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

    const addresses = performanceFetchedRef.current[key]?.addresses || [];

    worker.postMessage({
      task: 'processNominationPoolsRewardData',
      key,
      era: era.toString(),
      exposures,
      addresses,
      erasRewardPoints,
    });
  };

  // Handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data } = message;
      const { task, key, addresses } = data;

      if (task !== 'processNominationPoolsRewardData') {
        return;
      }

      // If addresses for the given key have changed or been removed, ignore the result.
      const current = getPerformanceFetchedKey(key);
      if (current.addresses.toString() !== addresses.toString()) {
        return;
      }

      // Update state with new data.
      setPoolRewardPoints(
        key,
        mergeDeep(getPoolRewardPoints(key), data.poolRewardData)
      );

      if (currentEra.isEqualTo(finishEra)) {
        updatePerformanceFetchedKey(key, 'synced');
      } else {
        const nextEra = BigNumber.max(currentEra.minus(1), 1);
        processEra(key, nextEra);
      }
    }
  };

  // Trigger worker to calculate pool reward data for garaphs once:
  //
  // - active era is synced.
  // - era reward points are fetched.
  // - bonded pools have been fetched.
  //
  // Re-calculates when any of the above change.
  useEffectIgnoreInitial(() => {
    if (
      api &&
      bondedPools.length &&
      activeEra.index.isGreaterThan(0) &&
      erasRewardPointsFetched === 'synced' &&
      getPerformanceFetchedKey('pool_list')?.status === 'unsynced'
    ) {
      startGetPoolPerformance(
        'pool_list',
        bondedPools.map(({ addresses }) => addresses.stash)
      );

      // TODO: Get subset of pools for JoinPool form and call `startGetPoolPerformance` for its key
      // here.
    }
  }, [
    bondedPools,
    activeEra,
    erasRewardPointsFetched,
    getPerformanceFetchedKey('pool_list'),
  ]);

  // Reset state data on network change.
  useEffectIgnoreInitial(() => {
    setCurrentEra(new BigNumber(0));
    setFinishEra(new BigNumber(0));
    setStateWithRef({}, setPoolRewardPointsState, poolRewardPointsRef);
    setStateWithRef({}, setPerformanceFetched, performanceFetchedRef);
  }, [network]);

  return (
    <PoolPerformanceContext.Provider
      value={{
        getPoolRewardPoints,
        getPerformanceFetchedKey,
        setPerformanceFetchedKey,
        updatePerformanceFetchedKey,
        startGetPoolPerformance,
      }}
    >
      {children}
    </PoolPerformanceContext.Provider>
  );
};
