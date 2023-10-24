// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable no-await-in-loop */

import type { Exposure } from 'contexts/Staking/types';
import type { ErasRewardPoints } from 'contexts/Validators/types';
import type { AnyApi, AnyJson } from 'types';

// eslint-disable-next-line no-restricted-globals
export const ctx: Worker = self as any;

// handle incoming message and route to correct handler.
ctx.addEventListener('message', async (event: AnyJson) => {
  const { data } = event;
  const { task } = data;
  let message: AnyJson = {};
  switch (task) {
    case 'processNominationPoolsRewardData':
      message = await processErasStakersForNominationPoolRewards(data);
      break;
    default:
  }
  postMessage({ task, ...message });
});

// Process `erasStakersClipped` and generate nomination pool reward data.
const processErasStakersForNominationPoolRewards = async ({
  bondedPools,
  era,
  erasRewardPoints,
  exposures,
}: {
  bondedPools: string[];
  era: string;
  erasRewardPoints: ErasRewardPoints;
  exposures: Exposure[];
}) => {
  const poolRewardData: Record<string, Record<string, string>> = {};

  for (const address of bondedPools) {
    let validator = null;
    for (const exposure of exposures) {
      const { others } = exposure.val;
      const inOthers = others.find((o: AnyApi) => o.who === address);

      if (inOthers) {
        validator = exposure.keys[1];
        break;
      }
    }

    if (validator) {
      const rewardPoints: string =
        erasRewardPoints[era]?.individual?.[validator || ''] ?? 0;
      if (!poolRewardData[address]) poolRewardData[address] = {};
      poolRewardData[address][era] = rewardPoints;
    }
  }

  return {
    poolRewardData,
  };
};
