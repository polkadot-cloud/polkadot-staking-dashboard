// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import BigNumber from 'bignumber.js';
import type { PoolRewardPointsKey } from 'contexts/Pools/PoolPerformance/types';
import type { Exposure } from 'contexts/Staking/types';
import type { ErasRewardPoints } from 'contexts/Validators/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ctx: Worker = self as any;

// handle incoming message and route to correct handler.
ctx.addEventListener('message', async (event: AnyJson) => {
  const { data } = event;
  const { task } = data;
  let message = {};
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
  key,
  addresses,
  era,
  erasRewardPoints,
  exposures,
}: {
  key: PoolRewardPointsKey;
  addresses: string[];
  era: string;
  erasRewardPoints: ErasRewardPoints;
  exposures: Exposure[];
}) => {
  const poolRewardData: Record<string, Record<string, string>> = {};

  const validators: Record<string, string[]> = {};

  for (const exposure of exposures) {
    const { others } = exposure.val;

    // Return the `addresses` that are present in `others` for this era.
    const addressesInOthers = addresses.filter((a) =>
      others.find(({ who }) => who === a)
    );

    for (const addressInOthers of addressesInOthers) {
      if (validators[addressInOthers]) {
        validators[addressInOthers].push(exposure.keys[1]);
      } else {
        validators[addressInOthers] = [exposure.keys[1]];
      }
    }
  }

  for (const entry of Object.entries(validators)) {
    const [entryAddress, entryValidators] = entry;

    const rewardPoints = entryValidators.reduce(
      (acc: BigNumber, entryValidator: string) =>
        acc.plus(
          erasRewardPoints[era]?.individual?.[entryValidator || ''] ?? 0
        ),
      new BigNumber(0)
    );

    if (!poolRewardData[entryAddress]) {
      poolRewardData[entryAddress] = {};
    }
    poolRewardData[entryAddress][era] = rewardPoints.toString();
  }

  return {
    key,
    addresses,
    poolRewardData,
  };
};
