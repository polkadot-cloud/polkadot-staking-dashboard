// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Paras } from 'types';

export const ParaList: Paras = {
  assethub: {
    endpoints: {
      rpc: 'wss://polkadot-asset-hub-rpc.polkadot.io',
    },
    ss58: 0,
    supportedAssets: [
      {
        key: 'Native',
        symbol: 'DOT',
        units: 10,
      },
      {
        key: 1984,
        symbol: 'USDT',
        units: 6,
      },
    ],
  },
  interlay: {
    endpoints: {
      rpc: 'wss://interlay.api.onfinality.io/public-ws',
    },
    ss58: 2032,
    supportedAssets: [
      {
        key: 'Token',
        symbol: 'IBTC',
        units: 8,
      },
      {
        key: 'ForeignAsset',
        symbol: '2', // USDT
        units: 6,
      },
      { key: 'Token', symbol: 'DOT', units: 10 },
    ],
  },
};

export const getParaMeta = (paraId: string) => {
  return ParaList[paraId];
};
