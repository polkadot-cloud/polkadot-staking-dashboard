// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { ReactNode, RefObject } from 'react'
import type {
  ActiveEra,
  ApiStatus,
  ChainConsts,
  ChainId,
  ChainSpec,
  NetworkId,
  ProviderType,
} from 'types'

export interface APIProviderProps {
  children: ReactNode
  network: NetworkId
}

export interface APINetworkMetrics {
  totalIssuance: BigNumber
  auctionCounter: BigNumber
  earliestStoredSession: BigNumber
}

export interface APIPoolsConfig {
  counterForPoolMembers: BigNumber
  counterForBondedPools: BigNumber
  counterForRewardPools: BigNumber
  lastPoolId: BigNumber
  maxPoolMembers: BigNumber | null
  maxPoolMembersPerPool: BigNumber | null
  maxPools: BigNumber | null
  minCreateBond: BigNumber
  minJoinBond: BigNumber
  globalMaxCommission: number
}

export interface APIStakingMetrics {
  fastUnstakeErasToCheckPerBlock: number
  minimumActiveStake: BigNumber
  totalValidators: BigNumber
  lastReward: BigNumber
  lastTotalStake: BigNumber
  validatorCount: BigNumber
  maxValidatorsCount: BigNumber
  minNominatorBond: BigNumber
  totalStaked: BigNumber
  counterForNominators: BigNumber
}

export interface APIContextInterface {
  getRpcEndpoint: (chain: ChainId) => string
  getApiStatus: (id: ChainId) => ApiStatus
  getChainSpec: (chain: ChainId) => ChainSpec
  getConsts: (chain: ChainId) => ChainConsts
  isReady: boolean
  providerType: ProviderType
  networkMetrics: APINetworkMetrics
  activeEra: ActiveEra
  activeEraRef: RefObject<ActiveEra>
  poolsConfig: APIPoolsConfig
  stakingMetrics: APIStakingMetrics
}
