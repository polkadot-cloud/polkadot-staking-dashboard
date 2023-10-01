// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { getUnixTime } from 'date-fns';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';

export const useEraTimeLeft = () => {
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra } = consts;
  const { activeEra } = useNetworkMetrics();

  // important to fetch the actual timeleft from when other components ask for it.
  const get = () => {
    // get timestamp of era start and convert to seconds.
    const start = activeEra.start.multipliedBy(0.001);

    // store the duration of an era in block numbers.
    const eraDurationBlocks = epochDuration.multipliedBy(sessionsPerEra);

    // estimate the duration of the era in seconds
    const eraDuration = eraDurationBlocks
      .multipliedBy(expectedBlockTime)
      .multipliedBy(0.001);

    // estimate the end time of the era
    const end = start.plus(eraDuration);

    // estimate remaining time of era.
    const timeleft = BigNumber.max(0, end.minus(getUnixTime(new Date())));

    // percentage of eraDuration
    const percentage = eraDuration.multipliedBy(0.01);
    const percentRemaining = timeleft.dividedBy(percentage);
    const percentSurpassed = new BigNumber(100).minus(percentRemaining);

    return { timeleft, percentSurpassed, percentRemaining };
  };

  return { get };
};
