// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';

export const FindingPoolsPercent = () => {
  const { getPoolPerformanceTask } = usePoolPerformance();

  // Get the pool performance task to determine if performance data is ready.
  const poolJoinPerformanceTask = getPoolPerformanceTask('pool_join');

  if (poolJoinPerformanceTask.status === 'synced') {
    return null;
  }

  // Calculate syncing status.
  const { startEra, currentEra, endEra } = poolJoinPerformanceTask;
  const totalEras = startEra.minus(endEra);
  const erasPassed = startEra.minus(currentEra);
  const percentPassed = erasPassed.isEqualTo(0)
    ? new BigNumber(0)
    : erasPassed.dividedBy(totalEras).multipliedBy(100);

  return (
    <span className="counter">
      {percentPassed.decimalPlaces(0).toFormat()}%
    </span>
  );
};
