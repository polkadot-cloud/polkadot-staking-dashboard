// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
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
import type { ActiveEraQuery } from '../query/activeEra'
import type { RelayMetricsQuery } from '../query/relayMetrics'
import type { ApiStatus } from '../spec/apiStatus'
import type { ChainSpecs } from '../spec/chainSpecs'

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

  activeEra: ActiveEraQuery<StakingApi>
  relayMetrics: RelayMetricsQuery<RelayApi>
}

// Default interface a default service factory returns
export type DefaultService<T extends keyof ServiceType> = {
  Service: ServiceType[T]
  apis: [DedotClient<Service[T][0]>, DedotClient<Service[T][1]>]
  ids: [NetworkId, SystemChainId]
}
