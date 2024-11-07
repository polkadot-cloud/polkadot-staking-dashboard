// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import type { NetworkName } from '../../types';
import type {
  ApiStatus,
  ConnectionType,
  PAPIChainSpecs,
} from 'model/Api/types';

export interface APIProviderProps {
  children: ReactNode;
  network: NetworkName;
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
  counterForNominators: BigNumber;
}

export interface APIContextInterface {
  api: ApiPromise | null;
  peopleApi: ApiPromise | null;
  chainSpecs: PAPIChainSpecs;
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
