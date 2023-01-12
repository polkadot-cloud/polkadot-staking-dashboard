// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { getUnixTime } from 'date-fns';

export const useEraTimeLeft = () => {
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra } = consts;
  const { metrics } = useNetworkMetrics();
  const { activeEra } = metrics;

  // important to fetch the actual timeleft from when other components ask for it.
  const get = () => {
    // get timestamp of era start and convert to seconds.
    let { start } = activeEra;
    start *= 0.001;

    // store the duration of an era in block numbers.
    const eraDurationBlocks = epochDuration * sessionsPerEra;

    // estimate the duration of the era in seconds
    const eraDuration = eraDurationBlocks * expectedBlockTime * 0.001;

    // estimate the end time of the era
    const end = start + eraDuration;

    // estimate remaining time of era.
    const timeleft = Math.max(0, end - getUnixTime(new Date()));

    // percentage of eraDuration
    const percentage = eraDuration * 0.01;
    const percentRemaining = timeleft / percentage;
    const percentSurpassed = 100 - percentRemaining;

    return { timeleft, percentSurpassed, percentRemaining };
  };

  return { get };
};

export default useEraTimeLeft;
