// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';

export const useErasToTimeLeft = () => {
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra } = consts;

  // converts a number of eras to timeleft in seconds.
  const erasToSeconds = (eras: number) => {
    if (!eras) {
      return 0;
    }
    // store the duration of an era in number of blocks.
    // TODO ISSUE: convert network consts from number to BigNumber.
    const eraDurationBlocks = new BigNumber(epochDuration).multipliedBy(
      sessionsPerEra
    );
    // estimate the duration of the era in seconds.
    const eraDuration = eraDurationBlocks
      .multipliedBy(expectedBlockTime)
      .multipliedBy(new BigNumber(0.001))
      .integerValue();

    // multiply by number of eras.
    return new BigNumber(eras).multipliedBy(eraDuration).toNumber();
  };

  return {
    erasToSeconds,
  };
};
