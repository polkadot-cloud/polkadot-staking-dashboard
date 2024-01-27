// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { U8aLike } from '@polkadot/util/types';
import type BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import type { AnyJson, NetworkName } from '../../types';
import type { ApiStatus } from 'static/APIController/types';

export interface APIProviderProps {
  children: ReactNode;
  network: NetworkName;
}

export interface APIChainState {
  chain: string | null;
  version: AnyJson;
  ss58Prefix: number;
}

export interface APIConstants {
  bondDuration: BigNumber;
  maxNominations: BigNumber;
  sessionsPerEra: BigNumber;
  maxExposurePageSize: BigNumber;
  historyDepth: BigNumber;
  maxElectingVoters: BigNumber;
  expectedBlockTime: BigNumber;
  epochDuration: BigNumber;
  existentialDeposit: BigNumber;
  fastUnstakeDeposit: BigNumber;
  poolsPalletId: U8aLike;
}

export interface APINetworkMetrics {
  totalIssuance: BigNumber;
  auctionCounter: BigNumber;
  earliestStoredSession: BigNumber;
  fastUnstakeErasToCheckPerBlock: number;
  minimumActiveStake: BigNumber;
}

export interface APIActiveEra {
  index: BigNumber;
  start: BigNumber;
}

export interface APIPoolsConfig {
  counterForPoolMembers: BigNumber;
  counterForBondedPools: BigNumber;
  counterForRewardPools: BigNumber;
  lastPoolId: BigNumber;
  maxPoolMembers: BigNumber | null;
  maxPoolMembersPerPool: BigNumber | null;
  maxPools: BigNumber | null;
  minCreateBond: BigNumber;
  minJoinBond: BigNumber;
  globalMaxCommission: number;
}

export interface APIStakingMetrics {
  totalNominators: BigNumber;
  totalValidators: BigNumber;
  lastReward: BigNumber;
  lastTotalStake: BigNumber;
  validatorCount: BigNumber;
  maxValidatorsCount: BigNumber;
  minNominatorBond: BigNumber;
  totalStaked: BigNumber;
}

export interface APIContextInterface {
  api: ApiPromise | null;
  chainState: APIChainState;
  isReady: boolean;
  apiStatus: ApiStatus;
  isLightClient: boolean;
  setIsLightClient: (isLightClient: boolean) => void;
  rpcEndpoint: string;
  setRpcEndpoint: (key: string) => void;
  consts: APIConstants;
  networkMetrics: APINetworkMetrics;
  activeEra: APIActiveEra;
  poolsConfig: APIPoolsConfig;
  stakingMetrics: APIStakingMetrics;
  isPagedRewardsActive: (era: BigNumber) => boolean;
}
