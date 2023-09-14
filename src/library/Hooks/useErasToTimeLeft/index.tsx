// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero } from '@polkadot-cloud/utils';
import type BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';

export const useErasToTimeLeft = () => {
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra } = consts;

  // converts a number of eras to timeleft in seconds.
  const erasToSeconds = (eras: BigNumber) => {
    if (!greaterThanZero(eras)) {
      return 0;
    }
    // store the duration of an era in number of blocks.
    const eraDurationBlocks = epochDuration.multipliedBy(sessionsPerEra);
    // estimate the duration of the era in seconds.
    const eraDuration = eraDurationBlocks
      .multipliedBy(expectedBlockTime)
      .multipliedBy(0.001)
      .integerValue();

    // multiply by number of eras.
    return eras.multipliedBy(eraDuration).toNumber();
  };

  return {
    erasToSeconds,
  };
};
