// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type {
  NetworkConfig,
  NetworkId,
  ServiceInterface,
  SystemChainId,
} from 'types'
import {
  ServiceClass,
  type PeopleChain,
  type RelayChain,
  type Service,
  type ServiceType,
  type StakingChain,
} from '.'
import type { CoreConsts } from '../consts/core'
import type { StakingConsts } from '../consts/staking'
import type { ApiStatus } from '../spec/apiStatus'
import type { ChainSpecs } from '../spec/chainSpecs'
import type { ActiveEraQuery } from '../subscribe/activeEra'
import type { BlockNumberQuery } from '../subscribe/blockNumber'
import type { EraRewardPointsQuery } from '../subscribe/eraRewardPoints'
import type { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import type { PoolsConfigQuery } from '../subscribe/poolsConfig'
import type { RelayMetricsQuery } from '../subscribe/relayMetrics'
import type { StakingMetricsQuery } from '../subscribe/stakingMetrics'

// Required interface for all default services
export abstract class DefaultServiceClass<
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  StakingApi extends StakingChain,
> extends ServiceClass {
  constructor(
    public networkConfig: NetworkConfig,
    public apiRelay: DedotClient<RelayApi>,
    public apiPeople: DedotClient<PeopleApi>
  ) {
    super()
  }
  abstract ids: [NetworkId, SystemChainId]
  abstract apiStatus: {
    relay: ApiStatus<RelayApi>
    people: ApiStatus<PeopleApi>
  }
  abstract relayChainSpec: ChainSpecs<RelayApi>
  abstract peopleChainSpec: ChainSpecs<PeopleApi>
  abstract coreConsts: CoreConsts<RelayApi>
  abstract stakingConsts: StakingConsts<StakingApi>
  abstract blockNumber: BlockNumberQuery<RelayApi>
  abstract activeEra: ActiveEraQuery<StakingApi>
  abstract relayMetrics: RelayMetricsQuery<RelayApi>
  abstract poolsConfig: PoolsConfigQuery<StakingApi>
  abstract stakingMetrics: StakingMetricsQuery<StakingApi>
  abstract eraRewardPoints: EraRewardPointsQuery<StakingApi>
  abstract fastUnstakeConfig: FastUnstakeConfigQuery<StakingApi>

  abstract interface: ServiceInterface
}

// Default interface a default service factory returns
export type DefaultService<T extends keyof ServiceType> = {
  Service: ServiceType[T]
  apis: [DedotClient<Service[T][0]>, DedotClient<Service[T][1]>]
  ids: [NetworkId, SystemChainId]
}
