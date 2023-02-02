// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { getUnixTime } from 'date-fns';

export const useErasToTimeLeft = () => {
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra } = consts;
  const { activeEra } = useNetworkMetrics();

  // converts a number of eras to timeleft in seconds.
  const erasToSeconds = (eras: number) => {
    if (!eras) {
      return 0;
    }
    // store the duration of an era in number of blocks.
    const eraDurationBlocks = epochDuration * sessionsPerEra;
    // estimate the duration of the era in seconds.
    const eraDuration = eraDurationBlocks * expectedBlockTime * 0.001;
    // multiply by number of eras.
    return eras * eraDuration;
  };

  const erasToTimeLeft = (eras: number) => {
    const end = activeEra.start * 0.001 + erasToSeconds(eras);
    const timeleft = Math.max(0, end - getUnixTime(new Date()));

    return timeleft;
  };

  return {
    erasToSeconds,
    erasToTimeLeft,
  };
};
