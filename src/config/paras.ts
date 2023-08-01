// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Paras } from 'types';

export const ParaList: Paras = {
  assethub: {
    endpoints: {
      rpc: 'wss://polkadot-asset-hub-rpc.polkadot.io',
    },
    units: 10,
    ss58: 0,
  },
  interlay: {
    endpoints: {
      rpc: 'wss://interlay.api.onfinality.io/public-ws',
    },
    units: 10,
    ss58: 2032,
  },
};

export const getParaMeta = (paraId: string) => {
  return ParaList[paraId];
};
