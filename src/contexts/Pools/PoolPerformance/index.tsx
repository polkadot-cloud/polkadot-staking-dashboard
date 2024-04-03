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
import {
  defaultPerformanceFetched,
  defaultPoolPerformanceContext,
} from './defaults';
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
    performanceFetched[key] || defaultPerformanceFetched;

  // Sets a pool performance fetching state under a given key.
  const setPerformanceFetchedKey = (
    key: PoolRewardPointsBatchKey,
    status: Sync,
    addresses: string[],
    currentEra: BigNumber,
    endEra: BigNumber
  ) => {
    setStateWithRef(
      {
        ...performanceFetchedRef.current,
        [key]: { status, addresses, endEra, currentEra },
      },
      setPerformanceFetched,
      performanceFetchedRef
    );

    // Reset pool reward points for the given key.
    if (status === 'syncing') {
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

  // Set current era for performance fetched key.
  const updatePerformanceFetchedCurrentEra = (
    key: PoolRewardPointsBatchKey,
    era: BigNumber
  ) => {
    if (!getPerformanceFetchedKey(key)) {
      return;
    }
    setStateWithRef(
      {
        ...performanceFetchedRef.current,
        [key]: { ...performanceFetchedRef.current[key], currentEra: era },
      },
      setPerformanceFetched,
      performanceFetchedRef
    );
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
        ...performanceFetchedRef.current,
        [key]: { ...performanceFetchedRef.current[key], status },
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
      setPerformanceFetchedKey(
        key,
        'synced',
        addresses,
        activeEra.index,
        activeEra.index
      );
      return;
    }

    // If the addresses have not changed for this key, exit early.
    const current = getPerformanceFetchedKey(key);
    if (current.addresses.toString() === addresses.toString()) {
      return;
    }

    const currentEra = BigNumber.max(activeEra.index.minus(1));
    const endEra = BigNumber.max(
      activeEra.index.minus(MaxEraRewardPointsEras),
      1
    );
    // Set as syncing and start processing.
    setPerformanceFetchedKey(key, 'syncing', addresses, currentEra, endEra);

    // Start processing from the previous active era.
    processEra(key, currentEra);
  };

  // Get era data and send to worker.
  const processEra = async (key: PoolRewardPointsBatchKey, era: BigNumber) => {
    if (!api) {
      return;
    }

    // NOTE: This will not make any difference on the first run.
    updatePerformanceFetchedCurrentEra(key, era);

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

      if (current.currentEra.isEqualTo(current.endEra)) {
        updatePerformanceFetchedKey(key, 'synced');
      } else {
        const nextEra = BigNumber.max(current.currentEra.minus(1), 1);
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
      getPerformanceFetchedKey('pool_join')?.status === 'unsynced'
    ) {
      // Generate a subset of pools to fetch performance data for. TODO: Send pools to JoinPool
      // canvas and only select those. Move this logic to a separate context.
      // const poolJoinSelection = shuffle(
      //   bondedPools
      //     .filter(({ state }) => state === 'Open')
      //     .map(({ addresses }) => addresses.stash)
      // ).slice(0, 25);
      // console.log(poolJoinSelection);

      startGetPoolPerformance(
        'pool_join',
        bondedPools.map(({ addresses }) => addresses.stash)
      );
    }
  }, [
    bondedPools,
    activeEra,
    erasRewardPointsFetched,
    getPerformanceFetchedKey('pool_join'),
  ]);

  // Reset state data on network change.
  useEffectIgnoreInitial(() => {
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
