// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { ReactNode, RefObject } from 'react'
import type {
  ApiStatus,
  ChainId,
  ChainSpec,
  NetworkId,
  ProviderType,
} from 'types'

export interface APIProviderProps {
  children: ReactNode
  network: NetworkId
}

export interface APIConstants {
  bondDuration: BigNumber
  maxNominations: BigNumber
  sessionsPerEra: BigNumber
  maxExposurePageSize: BigNumber
  historyDepth: BigNumber
  expectedBlockTime: BigNumber
  epochDuration: BigNumber
  existentialDeposit: BigNumber
  fastUnstakeDeposit: BigNumber
  poolsPalletId: Uint8Array
}

export interface APINetworkMetrics {
  totalIssuance: BigNumber
  auctionCounter: BigNumber
  earliestStoredSession: BigNumber
  fastUnstakeErasToCheckPerBlock: number
  minimumActiveStake: BigNumber
}

export interface APIActiveEra {
  index: BigNumber
  start: BigNumber
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
  getApiStatus: (id: ChainId) => ApiStatus
  getChainSpec: (chain: ChainId) => ChainSpec
  isReady: boolean
  providerType: ProviderType
  getRpcEndpoint: (chain: string) => string
  consts: APIConstants
  networkMetrics: APINetworkMetrics
  activeEra: APIActiveEra
  activeEraRef: RefObject<APIActiveEra>
  poolsConfig: APIPoolsConfig
  stakingMetrics: APIStakingMetrics
}
