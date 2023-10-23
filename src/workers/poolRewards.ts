// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable no-await-in-loop */

import type { AnyApi, AnyJson } from 'types';
import { ApiPromise, ScProvider, WsProvider } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { formatRawExposures } from 'contexts/Staking/Utils';

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
// TODO: takes pool stash addresses as input.
const processErasStakersForNominationPoolRewards = async ({
  activeEra,
  maxEras,
  endpoints,
  bondedPools,
  isLightClient,
  erasRewardPoints,
}: AnyJson) => {
  // Conenct to light client or RPC.
  let newProvider;
  if (isLightClient) {
    const Sc = await import('@substrate/connect');
    newProvider = new ScProvider(Sc, endpoints.lightClient);
    await newProvider.connect();
  } else {
    newProvider = new WsProvider(endpoints.rpc);
  }
  const api = await ApiPromise.create({ provider: newProvider });

  const startEra = BigNumber.max(new BigNumber(activeEra).minus(1), 1);
  const endEra = BigNumber.max(new BigNumber(activeEra).minus(maxEras), 1);
  let cursorEra = startEra;

  const eras = [];
  do {
    eras.push(cursorEra);
    cursorEra = cursorEra.minus(1);
  } while (cursorEra.isGreaterThanOrEqualTo(endEra));

  const poolRewardData: Record<string, Record<string, string>> = {};

  await Promise.all(
    eras.map(async (era) => {
      const exposures = await api.query.staking.erasStakersClipped.entries(
        era.toString()
      );
      const formatted = formatRawExposures(exposures);

      for (const address of bondedPools) {
        let validator = null;
        for (const exposure of formatted) {
          const { others } = exposure.val;
          const inOthers = others.find((o: AnyApi) => o.who === address);

          if (inOthers) {
            validator = exposure.keys[1];
            break;
          }
        }

        if (validator) {
          const rewardPoints: string =
            erasRewardPoints[era.toString()]?.individual?.[validator || ''] ??
            0;
          if (!poolRewardData[address]) poolRewardData[address] = {};
          poolRewardData[address][era.toString()] = rewardPoints;
        }
      }
    })
  );

  return {
    poolRewardData,
  };
};
