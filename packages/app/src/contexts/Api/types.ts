// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiStatus, ConnectionType, PapiChainSpec } from 'api/types';
import type BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import type { NetworkId } from '../../common-types';

export interface APIProviderProps {
  children: ReactNode;
  network: NetworkId;
}

export interface APIConstants {
  bondDuration: BigNumber;
  maxNominations: BigNumber;
  sessionsPerEra: BigNumber;
  maxExposurePageSize: BigNumber;
  historyDepth: BigNumber;
  expectedBlockTime: BigNumber;
  epochDuration: BigNumber;
  existentialDeposit: BigNumber;
  fastUnstakeDeposit: BigNumber;
  poolsPalletId: Uint8Array;
}

export interface APINetworkMetrics {
  totalIssuance: BigNumber;
  auctionCounter: BigNumber;
  earliestStoredSession: BigNumber;
  fastUnstakeErasToCheckPerBlock: number;
  minimumActiveStake: BigNumber;
}

export type PapiChainSpecContext = PapiChainSpec & {
  received: boolean;
};
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
  totalValidators: BigNumber;
  lastReward: BigNumber;
  lastTotalStake: BigNumber;
  validatorCount: BigNumber;
  maxValidatorsCount: BigNumber;
  minNominatorBond: BigNumber;
  totalStaked: BigNumber;
  counterForNominators: BigNumber;
}

export interface APIContextInterface {
  chainSpecs: PapiChainSpecContext;
  isReady: boolean;
  apiStatus: ApiStatus;
  peopleApiStatus: ApiStatus;
  connectionType: ConnectionType;
  setConnectionType: (connectionType: ConnectionType) => void;
  rpcEndpoint: string;
  setRpcEndpoint: (key: string) => void;
  consts: APIConstants;
  networkMetrics: APINetworkMetrics;
  activeEra: APIActiveEra;
  poolsConfig: APIPoolsConfig;
  stakingMetrics: APIStakingMetrics;
}
