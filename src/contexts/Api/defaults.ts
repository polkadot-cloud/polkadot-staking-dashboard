// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { NetworkList } from 'config/networks';
import type {
  APIChainState,
  APIConstants,
  APIContextInterface,
} from 'contexts/Api/types';

export const consts: APIConstants = {
  bondDuration: new BigNumber(0),
  maxNominations: new BigNumber(0),
  sessionsPerEra: new BigNumber(0),
  maxNominatorRewardedPerValidator: new BigNumber(0),
  historyDepth: new BigNumber(0),
  maxElectingVoters: new BigNumber(0),
  expectedBlockTime: new BigNumber(0),
  epochDuration: new BigNumber(0),
  existentialDeposit: new BigNumber(0),
  fastUnstakeDeposit: new BigNumber(0),
  poolsPalletId: stringToU8a('0'),
  ss58Prefix: new BigNumber(0),
};

export const chainState: APIChainState = {
  chain: undefined,
  version: undefined,
};

export const defaultApiContext: APIContextInterface = {
  // eslint-disable-next-line
  switchNetwork: async (n, lc) => {
    await new Promise((resolve) => resolve(null));
  },
  api: null,
  consts,
  chainState,
  isLightClient: false,
  isReady: false,
  apiStatus: 'disconnected',
  network: NetworkList.polkadot,
};
