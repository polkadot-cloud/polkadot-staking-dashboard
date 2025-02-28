// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';

export const useErasPerDay = () => {
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra, historyDepth } =
    consts;

  const DAY_MS = new BigNumber(86400000);

  // Calculates how many eras there are in a 24 hour period.
  const getErasPerDay = (): BigNumber => {
    if (
      epochDuration.isZero() ||
      sessionsPerEra.isZero() ||
      expectedBlockTime.isZero()
    ) {
      return new BigNumber(0);
    }

    const blocksPerEra = epochDuration.multipliedBy(sessionsPerEra);
    const msPerEra = blocksPerEra.multipliedBy(expectedBlockTime);

    return DAY_MS.dividedBy(msPerEra);
  };

  return {
    erasPerDay: getErasPerDay(),
    maxSupportedDays: historyDepth.isZero()
      ? 0
      : historyDepth
          .dividedBy(getErasPerDay())
          .integerValue(BigNumber.ROUND_HALF_DOWN)
          .toNumber(),
  };
};
