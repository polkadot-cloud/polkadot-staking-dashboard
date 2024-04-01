// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { useOverlay } from 'kits/Overlay/Provider';
import { JoinPoolInterfaceWrapper } from './Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useMemo, useState } from 'react';
import { Header } from './Header';
import { Overview } from './Overview';
import { Nominations } from './Nominations';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import { MaxEraRewardPointsEras } from 'consts';

export const JoinPool = () => {
  const {
    config: { options },
  } = useOverlay().canvas;
  const { validators } = useValidators();
  const { poolRewardPoints } = usePoolPerformance();
  const { poolsMetaData, poolsNominations, bondedPools } = useBondedPools();

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState(0);

  // Filter bonded pools to only those that are open and that have active daily rewards for the last
  // `MaxEraRewardPointsEras` eras.
  const filteredBondedPools = useMemo(
    () =>
      bondedPools.filter((pool) => {
        const rawEraRewardPoints = poolRewardPoints[pool.addresses.stash] || {};
        const rewardPoints = Object.values(rawEraRewardPoints);
        const activeDaily = rewardPoints.every((points) => Number(points) > 0);
        return (
          pool.state === 'Open' &&
          activeDaily &&
          rewardPoints.length === MaxEraRewardPointsEras
        );
      }),
    [bondedPools, poolRewardPoints]
  );

  const randomKey = (filteredBondedPools.length * Math.random()) << 0;
  const bondedPool = filteredBondedPools[randomKey];

  // The selected pool id. Use the provided poolId, or assign a random pool.
  const [selectedPoolId, setSelectedPoolId] = useState<number>(
    options?.poolId || bondedPool.id || 0
  );

  // Extract validator entries from pool targets
  const targets = poolsNominations[bondedPool.id]?.targets || [];
  const targetValidators = validators.filter(({ address }) =>
    targets.includes(address)
  );

  return (
    <CanvasFullScreenWrapper>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedPoolId={setSelectedPoolId}
        bondedPool={bondedPool}
        metadata={poolsMetaData[selectedPoolId]}
      />

      <JoinPoolInterfaceWrapper>
        <div className="content">
          {activeTab === 0 && <Overview bondedPool={bondedPool} />}
          {activeTab === 1 && (
            <Nominations
              stash={bondedPool.addresses.stash}
              targets={targetValidators}
            />
          )}
        </div>
      </JoinPoolInterfaceWrapper>
    </CanvasFullScreenWrapper>
  );
};
