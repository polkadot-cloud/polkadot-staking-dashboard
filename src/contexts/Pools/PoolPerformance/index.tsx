// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import { MaxEraRewardPointsEras } from 'consts';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import Worker from 'workers/poolPerformance?worker';
import { useNetwork } from 'contexts/Network';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useApi } from 'contexts/Api';
import type { Sync } from '@polkadot-cloud/react/types';
import BigNumber from 'bignumber.js';
import { formatRawExposures } from 'contexts/Staking/Utils';
import { mergeDeep } from '@polkadot-cloud/utils';
import type { PoolPerformanceContextInterface } from './types';
import { defaultPoolPerformanceContext } from './defaults';

const worker = new Worker();

export const PoolPerformanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api } = useApi();
  const { network } = useNetwork();
  const { bondedPools } = useBondedPools();
  const { activeEra } = useNetworkMetrics();
  const { erasRewardPointsFetched, erasRewardPoints } = useValidators();

  // Store whether pool performance data is being fetched.
  const [poolRewardPointsFetched, setPoolRewardPointsFetched] =
    useState<Sync>('unsynced');

  // Store pool performance data.
  const [poolRewardPoints, setPoolRewardPoints] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store the currently active era being processed for pool performance.
  const [currentEra, setCurrentEra] = useState<BigNumber>(new BigNumber(0));

  // Store the earliest era that should be processed.
  const [finishEra, setFinishEra] = useState<BigNumber>(new BigNumber(0));

  // Handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data } = message;
      const { task } = data;
      if (task !== 'processNominationPoolsRewardData') return;

      // Update state with new data.
      const { poolRewardData } = data;
      setPoolRewardPoints(mergeDeep(poolRewardPoints, poolRewardData));

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
    if (!api) return;
    setCurrentEra(era);
    const result = await api.query.staking.erasStakersClipped.entries(
      era.toString()
    );
    const exposures = formatRawExposures(result);
    worker.postMessage({
      task: 'processNominationPoolsRewardData',
      era: era.toString(),
      exposures,
      bondedPools: bondedPools.map((b) => b.addresses.stash),
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
    setPoolRewardPoints({});
    setCurrentEra(new BigNumber(0));
    setFinishEra(new BigNumber(0));
    setPoolRewardPointsFetched('unsynced');
  }, [network]);

  return (
    <PoolPerformanceContext.Provider
      value={{
        poolRewardPointsFetched,
        poolRewardPoints,
      }}
    >
      {children}
    </PoolPerformanceContext.Provider>
  );
};

export const PoolPerformanceContext =
  React.createContext<PoolPerformanceContextInterface>(
    defaultPoolPerformanceContext
  );

export const usePoolPerformance = () =>
  React.useContext(PoolPerformanceContext);
