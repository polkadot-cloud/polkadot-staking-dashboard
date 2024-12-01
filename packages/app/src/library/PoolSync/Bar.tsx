// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import type { PoolRewardPointsKey } from 'types';

export const PoolSyncBar = ({
  performanceKey,
}: {
  performanceKey: PoolRewardPointsKey;
}) => {
  const { getPoolPerformanceTask } = usePoolPerformance();

  // Get the pool performance task to determine if performance data is ready.
  const poolJoinPerformanceTask = getPoolPerformanceTask(performanceKey);

  // Calculate syncing status.
  const { startEra, currentEra, endEra } = poolJoinPerformanceTask;
  const totalEras = startEra.minus(endEra);
  const erasPassed = startEra.minus(currentEra);
  const percentPassed = erasPassed.isEqualTo(0)
    ? new BigNumber(0)
    : erasPassed.dividedBy(totalEras).multipliedBy(100);

  return (
    <div className="loader">
      <div>
        <span
          className="progress"
          style={{ width: `${percentPassed}%` }}
        ></span>
      </div>
    </div>
  );
};
