// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { MaxEraRewardPointsEras } from 'consts';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import Worker from 'workers/poolPerformance?worker';
import { useNetwork } from 'contexts/Network';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useApi } from 'contexts/Api';
import BigNumber from 'bignumber.js';
import { mergeDeep, setStateWithRef } from '@w3ux/utils';
import { useStaking } from 'contexts/Staking';
import type {
  PoolPerformanceContextInterface,
  PoolPerformanceTasks,
  PoolRewardPoints,
  PoolRewardPointsMap,
  PoolRewardPointsKey,
} from './types';
import {
  defaultPoolPerformanceTask,
  defaultPoolPerformanceContext,
} from './defaults';
import type { Sync } from '@w3ux/types';

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
  const { api, activeEra } = useApi();
  const { getPagedErasStakers } = useStaking();
  const { erasRewardPoints } = useValidators();

  // Store  pool performance task data under a given key as it is being fetched . NOTE: Requires a
  // ref to be accessed in `processEra` before re-render.
  const [tasks, setTasks] = useState<PoolPerformanceTasks>({});
  const tasksRef = useRef(tasks);

  // Store pool performance data. NOTE: Requires a ref to update state with current data.
  const [poolRewardPoints, setPoolRewardPointsState] =
    useState<PoolRewardPointsMap>({});
  const poolRewardPointsRef = useRef(poolRewardPoints);

  // Gets a batch of pool reward points, or returns an empty object otherwise.
  const getPoolRewardPoints = (key: PoolRewardPointsKey) =>
    poolRewardPoints?.[key] || {};

  // Sets a batch of pool reward points.
  const setPoolRewardPoints = (
    key: PoolRewardPointsKey,
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
  const getPoolPerformanceTask = (key: PoolRewardPointsKey) =>
    tasks[key] || defaultPoolPerformanceTask;

  // Sets a pool performance task under a given key.
  const setNewPoolPerformanceTask = (
    key: PoolRewardPointsKey,
    status: Sync,
    addresses: string[],
    currentEra: BigNumber,
    endEra: BigNumber
  ) => {
    const startEra = activeEra.index;

    setStateWithRef(
      {
        ...tasksRef.current,
        [key]: { status, addresses, startEra, endEra, currentEra },
      },
      setTasks,
      tasksRef
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
  const updateTaskCurrentEra = (key: PoolRewardPointsKey, era: BigNumber) => {
    if (!getPoolPerformanceTask(key)) {
      return;
    }
    setStateWithRef(
      {
        ...tasksRef.current,
        [key]: { ...tasksRef.current[key], currentEra: era },
      },
      setTasks,
      tasksRef
    );
  };

  // Updates an existing performance fetched key with a new status.
  const updatePoolPerformanceTask = (
    key: PoolRewardPointsKey,
    status: Sync
  ) => {
    if (!getPoolPerformanceTask(key)) {
      return;
    }
    setStateWithRef(
      {
        ...tasksRef.current,
        [key]: { ...tasksRef.current[key], status },
      },
      setTasks,
      tasksRef
    );
  };

  // Start fetching pool performance data, starting from the current era.
  const startPoolRewardPointsFetch = async (
    key: PoolRewardPointsKey,
    addresses: string[]
  ) => {
    // Set as synced and exit early if there are no addresses to process.
    if (!addresses.length) {
      setNewPoolPerformanceTask(
        key,
        'synced',
        addresses,
        activeEra.index,
        activeEra.index
      );
      return;
    }

    // If the addresses have not changed for this key, exit early.
    const current = getPoolPerformanceTask(key);
    if (current.addresses.toString() === addresses.toString()) {
      return;
    }

    const currentEra = BigNumber.max(activeEra.index.minus(1));
    const endEra = BigNumber.max(
      activeEra.index.minus(MaxEraRewardPointsEras),
      1
    );
    // Set as syncing and start processing.
    setNewPoolPerformanceTask(key, 'syncing', addresses, currentEra, endEra);

    // Start processing from the previous active era.
    processEra(key, currentEra);
  };

  // Get era data and send to worker.
  const processEra = async (key: PoolRewardPointsKey, era: BigNumber) => {
    if (!api) {
      return;
    }

    // NOTE: This will not make any difference on the first run.
    updateTaskCurrentEra(key, era);

    const exposures = await getPagedErasStakers(era.toString());
    const addresses = tasksRef.current[key]?.addresses || [];

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
      const current = getPoolPerformanceTask(key);

      if (current.addresses.toString() !== addresses.toString()) {
        return;
      }

      // Update state with new data.
      setPoolRewardPoints(
        key,
        mergeDeep(getPoolRewardPoints(key), data.poolRewardData)
      );

      if (current.currentEra.isEqualTo(current.endEra)) {
        updatePoolPerformanceTask(key, 'synced');
      } else {
        const nextEra = BigNumber.max(current.currentEra.minus(1), 1);
        processEra(key, nextEra);
      }
    }
  };

  // Reset state data on network change.
  useEffectIgnoreInitial(() => {
    setStateWithRef({}, setPoolRewardPointsState, poolRewardPointsRef);
    setStateWithRef({}, setTasks, tasksRef);
  }, [network]);

  return (
    <PoolPerformanceContext.Provider
      value={{
        getPoolRewardPoints,
        getPoolPerformanceTask,
        setNewPoolPerformanceTask,
        updatePoolPerformanceTask,
        startPoolRewardPointsFetch,
      }}
    >
      {children}
    </PoolPerformanceContext.Provider>
  );
};
