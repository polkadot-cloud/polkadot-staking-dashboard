// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainProperties } from 'dedot/types/json-rpc'
import type { HexString } from 'dedot/utils'
import type { FunctionComponent, SVGProps } from 'react'

export type ChainId = NetworkId | SystemChainId

export type NetworkId = 'polkadot' | 'kusama' | 'westend'

export type SystemChainId =
  | 'people-polkadot'
  | 'people-kusama'
  | 'people-westend'
  | 'statemint'
  | 'statemine'
  | 'westmint'

export type ProviderType = 'ws' | 'sc'

export type Networks = Record<string, Network>

export type RpcEndpoints = Record<string, string>

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready'

export interface ActiveEra {
  index: number
  start: bigint
}

export interface ChainSpec {
  genesisHash: HexString
  properties: ChainProperties
  existentialDeposit: bigint
  version: ChainSpecVersion
}

export interface ChainSpecVersion {
  specName: string
  implName: string
  authoringVersion: number
  specVersion: number
  implVersion: number
  apis: (readonly [HexString, number])[]
  transactionVersion: number
  stateVersion: number
}

export interface ChainConsts {
  bondDuration: number
  sessionsPerEra: number
  maxExposurePageSize: number
  historyDepth: number
  epochDuration: bigint
  expectedBlockTime: bigint
  fastUnstakeDeposit: bigint
  poolsPalletId: Uint8Array
}

export interface RelayMetrics {
  auctionCounter: number
  earliestStoredSession: number
}

export interface PoolsConfig {
  counterForPoolMembers: number
  counterForBondedPools: number
  counterForRewardPools: number
  lastPoolId: number
  maxPoolMembers: number | undefined
  maxPoolMembersPerPool: number | undefined
  maxPools: number | undefined
  minCreateBond: bigint
  minJoinBond: bigint
  globalMaxCommission: number
}

export interface StakingMetrics {
  totalIssuance: bigint
  erasToCheckPerBlock: number
  minimumActiveStake: bigint
  counterForValidators: number
  maxValidatorsCount: number | undefined
  validatorCount: number
  lastReward: bigint | undefined
  lastTotalStake: bigint
  minNominatorBond: bigint
  totalStaked: bigint
  counterForNominators: number
}

export interface NetworkConfig {
  network: NetworkId
  rpcEndpoints: Record<string, string>
  providerType: ProviderType
}

export interface Network {
  name: NetworkId
  endpoints: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getLightClient: () => Promise<any>
    rpc: Record<string, string>
  }
  unit: string
  units: number
  ss58: number
  defaultFeeReserve: bigint
  meta: {
    stakingChain: ChainId
    subscanBalanceChainId: string
  }
}

export interface SystemChain {
  name: string
  ss58: number
  units: number
  unit: string
  defaultFeeReserve: bigint
  endpoints: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getLightClient: () => Promise<any>
    rpc: Record<string, string>
  }
  relayChain: NetworkId
}

export interface ChainIcons {
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >
  token: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >
  inline: {
    svg: FunctionComponent<
      SVGProps<SVGSVGElement> & { title?: string | undefined }
    >
    size: string
  }
}
