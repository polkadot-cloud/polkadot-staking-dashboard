// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Paras } from 'types';

export const ParaList: Paras = {
  interlay: {
    endpoints: {
      rpc: 'wss://interlay.api.onfinality.io/public-ws',
    },
    unit: 'INTR',
    units: 10,
    ss58: 2032,
  },
};

export const getParaMeta = (paraId: string) => {
  return ParaList[paraId];
};
