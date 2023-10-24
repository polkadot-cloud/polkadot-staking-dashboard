// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import { MaxEraRewardPointsEras } from 'consts';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import Worker from 'workers/poolPerformance?worker';
import { useNetwork } from 'contexts/Network';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import type { AnyJson } from 'types';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useApi } from 'contexts/Api';
import type { Sync } from '@polkadot-cloud/react/types';
import type { PoolPerformanceContextInterface } from './types';
import { defaultPoolPerformanceContext } from './defaults';

const worker = new Worker();

export const PoolPerformanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    networkData: { endpoints },
  } = useNetwork();
  const { network } = useNetwork();
  const { isLightClient } = useApi();
  const { bondedPools } = useBondedPools();
  const { activeEra } = useNetworkMetrics();
  const { erasRewardPointsFetched, erasRewardPoints } = useValidators();

  // Store whether pool performance data is being fetched.
  const [poolRewardPointsFetched, setPoolRewardPointsFetched] =
    useState<Sync>('unsynced');

  // Store pool performance data.
  const [poolRewardPoints, setPoolRewardPoints] = useState<AnyJson>({});

  // Handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data } = message;
      const { task } = data;
      if (task !== 'processNominationPoolsRewardData') return;

      const { poolRewardData } = data;
      setPoolRewardPoints(poolRewardData);
      setPoolRewardPointsFetched('synced');
    }
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
      bondedPools.length &&
      activeEra.index.isGreaterThan(0) &&
      erasRewardPointsFetched === 'synced' &&
      poolRewardPointsFetched === 'unsynced'
    ) {
      setPoolRewardPointsFetched('syncing');

      worker.postMessage({
        task: 'processNominationPoolsRewardData',
        activeEra: activeEra.index.toString(),
        bondedPools: bondedPools.map((b) => b.addresses.stash),
        endpoints,
        isLightClient,
        erasRewardPoints,
        maxEras: MaxEraRewardPointsEras,
      });
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
