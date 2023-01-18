// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { NetworkList } from 'config/networks';
import { APIConstants, APIContextInterface } from 'contexts/Api/types';

export const consts: APIConstants = {
  bondDuration: 0,
  maxNominations: 0,
  sessionsPerEra: 0,
  maxNominatorRewardedPerValidator: 0,
  historyDepth: new BigNumber(0),
  maxElectingVoters: 0,
  expectedBlockTime: 0,
  epochDuration: 0,
  existentialDeposit: new BigNumber(0),
  fastUnstakeDeposit: new BigNumber(0),
  poolsPalletId: stringToU8a('0'),
};

export const defaultApiContext: APIContextInterface = {
  // eslint-disable-next-line
  connect: async () => {
    await new Promise((resolve) => resolve(null));
  },
  // eslint-disable-next-line
  switchNetwork: async (n, lc) => {
    await new Promise((resolve) => resolve(null));
  },
  api: null,
  consts,
  isLightClient: false,
  isReady: false,
  status: 'disconnected',
  network: NetworkList.polkadot,
};
