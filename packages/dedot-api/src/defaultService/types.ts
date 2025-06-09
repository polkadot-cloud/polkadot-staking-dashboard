// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Subscription } from 'rxjs'
import type {
  NetworkConfig,
  NetworkId,
  ServiceInterface,
  SystemChainId,
} from 'types'
import type { CoreConsts } from '../consts/core'
import type { StakingConsts } from '../consts/staking'
import type { ApiStatus } from '../spec/apiStatus'
import type { ChainSpecs } from '../spec/chainSpecs'
import type { AccountBalanceQuery } from '../subscribe/accountBalance'
import type { ActiveEraQuery } from '../subscribe/activeEra'
import type { BlockNumberQuery } from '../subscribe/blockNumber'
import type { EraRewardPointsQuery } from '../subscribe/eraRewardPoints'
import type { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import type { FastUnstakeQueueQuery } from '../subscribe/fastUnstakeQueue'
import type { PoolsConfigQuery } from '../subscribe/poolsConfig'
import type { RelayMetricsQuery } from '../subscribe/relayMetrics'
import type { StakingMetricsQuery } from '../subscribe/stakingMetrics'
import type {
  ActivePools,
  AssetHubChain,
  BondedAccounts,
  PeopleChain,
  PoolMemberships,
  Proxies,
  RelayChain,
  Service,
  ServiceType,
  StakingChain,
  StakingLedgers,
} from '../types'
import { ServiceClass } from '../types'

// Required interface for all default services
export abstract class DefaultServiceClass<
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  HubApi extends AssetHubChain,
  StakingApi extends StakingChain,
> extends ServiceClass {
  constructor(
    public networkConfig: NetworkConfig,
    public apiRelay: DedotClient<RelayApi>,
    public apiPeople: DedotClient<PeopleApi>,
    public apiHub: DedotClient<HubApi>
  ) {
    super()
  }
  abstract ids: [NetworkId, SystemChainId, SystemChainId]
  abstract apiStatus: {
    relay: ApiStatus<RelayApi>
    people: ApiStatus<PeopleApi>
    hub: ApiStatus<HubApi>
  }
  abstract getApi: (
    id: string
  ) => DedotClient<RelayApi> | DedotClient<PeopleApi> | DedotClient<HubApi>

  abstract relayChainSpec: ChainSpecs<RelayApi>
  abstract peopleChainSpec: ChainSpecs<PeopleApi>
  abstract hubChainSpec: ChainSpecs<HubApi>

  abstract coreConsts: CoreConsts<RelayApi>
  abstract stakingConsts: StakingConsts<StakingApi>
  abstract blockNumber: BlockNumberQuery<RelayApi>
  abstract activeEra: ActiveEraQuery<StakingApi>
  abstract relayMetrics: RelayMetricsQuery<RelayApi>
  abstract poolsConfig: PoolsConfigQuery<StakingApi>
  abstract stakingMetrics: StakingMetricsQuery<StakingApi>
  abstract eraRewardPoints: EraRewardPointsQuery<StakingApi>
  abstract fastUnstakeConfig: FastUnstakeConfigQuery<StakingApi>
  abstract fastUnstakeQueue: FastUnstakeQueueQuery<StakingApi>

  subActiveAddress: Subscription
  subImportedAccounts: Subscription
  subActiveEra: Subscription
  subAccountBalances: AccountBalances<RelayApi, PeopleApi, HubApi>
  subBonded: BondedAccounts<StakingApi>
  subStakingLedgers: StakingLedgers<StakingApi>
  subActivePoolIds: Subscription
  subActivePools: ActivePools<StakingApi>
  subPoolMemberships: PoolMemberships<StakingApi>
  subProxies: Proxies<StakingApi>
  subActiveProxies: Subscription

  abstract interface: ServiceInterface
}

// Default interface a default service factory returns
export type DefaultService<T extends keyof ServiceType> = {
  Service: ServiceType[T]
  apis: [
    DedotClient<Service[T][0]>,
    DedotClient<Service[T][1]>,
    DedotClient<Service[T][2]>,
  ]
  ids: [NetworkId, SystemChainId, SystemChainId]
}

// Account balances record
export type AccountBalances<
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  HubApi extends AssetHubChain,
> = {
  relay: Record<string, AccountBalanceQuery<RelayApi>>
  people: Record<string, AccountBalanceQuery<PeopleApi>>
  hub: Record<string, AccountBalanceQuery<HubApi>>
}
