// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import { stringToU8a } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import type {
  APIChainState,
  APIConstants,
  APIContextInterface,
} from 'contexts/Api/types';

export const defaultConsts: APIConstants = {
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
};

export const defaultChainState: APIChainState = {
  chain: null,
  version: {
    specVersion: 0,
  },
  ss58Prefix: 0,
};

export const defaultApiContext: APIContextInterface = {
  api: null,
  consts: defaultConsts,
  chainState: defaultChainState,
  isReady: false,
  apiStatus: 'disconnected',
  isLightClient: false,
  setIsLightClient: () => {},
  rpcEndpoint: '',
  setRpcEndpoint: (key) => {},
};
