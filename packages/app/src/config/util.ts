// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiChainType } from 'api/types';
import type { AnyApi, ChainId } from 'common-types';
import { NetworkList, SystemChainList } from './networks';

// Get the light client metadata for the given chain type and network.
export const getLightClientMetadata = (
  chainType: ApiChainType,
  network: ChainId
): {
  relay: {
    key: string;
    fn: () => Promise<AnyApi>;
  };
  para?: {
    key: string;
    fn: () => Promise<AnyApi>;
  };
} => {
  if (chainType === 'relay') {
    return {
      relay: {
        key: NetworkList[network].endpoints.lightClientKey,
        fn: NetworkList[network].endpoints.lightClient,
      },
    };
  }

  const { relayChain } = SystemChainList[network];
  const relay = NetworkList[relayChain];
  const para = SystemChainList[network];

  return {
    relay: {
      key: relay.endpoints.lightClientKey,
      fn: relay.endpoints.lightClient,
    },
    para: {
      key: para.endpoints.lightClientKey,
      fn: para.endpoints.lightClient,
    },
  };
};
