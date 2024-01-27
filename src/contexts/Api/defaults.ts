// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { stringToU8a } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import type {
  APIActiveEra,
  APIChainState,
  APIConstants,
  APIContextInterface,
  APINetworkMetrics,
  APIPoolsConfig,
  APIStakingMetrics,
} from 'contexts/Api/types';

export const defaultChainState: APIChainState = {
  chain: null,
  version: {
    specVersion: 0,
  },
  ss58Prefix: 0,
};

export const defaultConsts: APIConstants = {
  bondDuration: new BigNumber(0),
  maxNominations: new BigNumber(0),
  sessionsPerEra: new BigNumber(0),
  maxExposurePageSize: new BigNumber(0),
  historyDepth: new BigNumber(0),
  maxElectingVoters: new BigNumber(0),
  expectedBlockTime: new BigNumber(0),
  epochDuration: new BigNumber(0),
  existentialDeposit: new BigNumber(0),
  fastUnstakeDeposit: new BigNumber(0),
  poolsPalletId: stringToU8a('0'),
};

export const defaultNetworkMetrics: APINetworkMetrics = {
  totalIssuance: new BigNumber(0),
  auctionCounter: new BigNumber(0),
  earliestStoredSession: new BigNumber(0),
  fastUnstakeErasToCheckPerBlock: 0,
  minimumActiveStake: new BigNumber(0),
};

export const defaultActiveEra: APIActiveEra = {
  index: new BigNumber(0),
  start: new BigNumber(0),
};

export const defaultPoolsConfig: APIPoolsConfig = {
  counterForPoolMembers: new BigNumber(0),
  counterForBondedPools: new BigNumber(0),
  counterForRewardPools: new BigNumber(0),
  lastPoolId: new BigNumber(0),
  maxPoolMembers: null,
  maxPoolMembersPerPool: null,
  maxPools: null,
  minCreateBond: new BigNumber(0),
  minJoinBond: new BigNumber(0),
  globalMaxCommission: 0,
};

export const defaultStakingMetrics: APIStakingMetrics = {
  totalNominators: new BigNumber(0),
  totalValidators: new BigNumber(0),
  lastReward: new BigNumber(0),
  lastTotalStake: new BigNumber(0),
  validatorCount: new BigNumber(0),
  maxValidatorsCount: new BigNumber(0),
  minNominatorBond: new BigNumber(0),
  totalStaked: new BigNumber(0),
};

export const defaultApiContext: APIContextInterface = {
  api: null,
  chainState: defaultChainState,
  isReady: false,
  apiStatus: 'disconnected',
  isLightClient: false,
  setIsLightClient: () => {},
  rpcEndpoint: '',
  setRpcEndpoint: (key) => {},
  consts: defaultConsts,
  networkMetrics: defaultNetworkMetrics,
  activeEra: defaultActiveEra,
  poolsConfig: defaultPoolsConfig,
  stakingMetrics: defaultStakingMetrics,
  isPagedRewardsActive: (e) => false,
};
