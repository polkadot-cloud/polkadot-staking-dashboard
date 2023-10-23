// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from 'types';
import { ApiPromise, ScProvider, WsProvider } from '@polkadot/api';

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
  era,
  maxEras,
  endpoints,
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

  // Starting at `era` through `maxEras` and accumulate `bondedPools` validator points.
  //     Iterate bondedPools
  //         Iterate erasStakers.others to find pool stash address as nominator, & get validator.
  //         Check validator rewards in `erasRewardPoints` for this era.
  //         Add to pool rewards data.

  // Test: get genesis hash
  const genesisHash = api.genesisHash.toHex();

  // TODO: revise what actually needs to be sent back.
  return {
    maxEras,
    genesisHash,
    someEra: era,
    erasRewardPoints,
  };
};
