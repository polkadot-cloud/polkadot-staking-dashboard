// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';

export const useErasToTimeleft = () => {
  const { consts } = useApi();
  const { epochDuration, expectedBlockTime, sessionsPerEra } = consts;

  const erasToTimeLeft = (eras: number) => {
    // store the duration of an era in block numbers.
    const eraDurationBlocks = epochDuration * sessionsPerEra;
    // estimate the duration of the era in seconds
    const eraDuration = eraDurationBlocks * expectedBlockTime * 0.001;
    return eras * eraDuration;
  };

  return {
    erasToTimeLeft,
  };
};
