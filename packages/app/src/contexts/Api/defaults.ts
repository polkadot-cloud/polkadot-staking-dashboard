// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type {
  APIActiveEra,
  APIConstants,
  APINetworkMetrics,
  APIPoolsConfig,
  APIStakingMetrics,
} from 'contexts/Api/types'
import type { ChainSpec } from 'types'

export const defaultConsts: APIConstants = {
  bondDuration: new BigNumber(0),
  maxNominations: new BigNumber(0),
  sessionsPerEra: new BigNumber(0),
  maxExposurePageSize: new BigNumber(0),
  historyDepth: new BigNumber(0),
  expectedBlockTime: new BigNumber(0),
  epochDuration: new BigNumber(0),
  existentialDeposit: new BigNumber(0),
  fastUnstakeDeposit: new BigNumber(0),
  poolsPalletId: new Uint8Array([0]),
}

export const defaultNetworkMetrics: APINetworkMetrics = {
  totalIssuance: new BigNumber(0),
  auctionCounter: new BigNumber(0),
  earliestStoredSession: new BigNumber(0),
  fastUnstakeErasToCheckPerBlock: 0,
  minimumActiveStake: new BigNumber(0),
}

export const defaultChainSpecs: ChainSpec = {
  genesisHash: '0x',
  properties: {
    isEthereum: false,
    ss58Format: 0,
    tokenDecimals: 0,
    tokenSymbol: '',
  },
  existentialDeposit: 0n,
  version: {
    apis: [],
    authoringVersion: 0,
    implName: '',
    implVersion: 0,
    specName: '',
    specVersion: 0,
    stateVersion: 0,
    transactionVersion: 0,
  },
}

export const defaultActiveEra: APIActiveEra = {
  index: new BigNumber(0),
  start: new BigNumber(0),
}

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
}

export const defaultStakingMetrics: APIStakingMetrics = {
  totalValidators: new BigNumber(0),
  lastReward: new BigNumber(0),
  lastTotalStake: new BigNumber(0),
  validatorCount: new BigNumber(0),
  maxValidatorsCount: new BigNumber(0),
  minNominatorBond: new BigNumber(0),
  totalStaked: new BigNumber(0),
  counterForNominators: new BigNumber(0),
}
