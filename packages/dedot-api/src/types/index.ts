// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  KusamaApi,
  PolkadotApi,
  WestendApi,
  WestendPeopleApi,
} from '@dedot/chaintypes'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig } from 'types'
import type { CoreConsts } from '../consts/core'
import type { StakingConsts } from '../consts/staking'
import type { KusamaService } from '../services/kusama'
import type { PolkadotService } from '../services/polkadot'
import type { WestendService } from '../services/westend'
import type { ApiStatus } from '../spec/apiStatus'
import type { ChainSpecs } from '../spec/chainSpecs'

// All available chains
export type Chain =
  | PolkadotApi
  | PolkadotPeopleApi
  | KusamaApi
  | KusamaPeopleApi
  | WestendApi
  | WestendPeopleApi

// Relay chains
export type RelayChain = PolkadotApi | KusamaApi | WestendApi

// People chains
export type PeopleChain = PolkadotPeopleApi | KusamaPeopleApi | WestendPeopleApi

// Chains that are used for staking and nomination pools
export type StakingChain = PolkadotApi | KusamaApi | WestendApi

// Mapping of service types for each network
export interface ServiceType {
  polkadot: typeof PolkadotService
  kusama: typeof KusamaService
  westend: typeof WestendService
}

// Mapping of the required chains for each service
export type Service = {
  polkadot: [PolkadotApi, PolkadotPeopleApi]
  kusama: [KusamaApi, KusamaPeopleApi]
  westend: [WestendApi, WestendPeopleApi]
}

// Generic service class that all services must implement
export abstract class ServiceClass {
  abstract start(): Promise<void>
  abstract unsubscribe(): Promise<void>
}

// Required interface default services must implement
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
  abstract apiEvents: {
    relay: ApiStatus<RelayApi>
    people: ApiStatus<PeopleApi>
  }
  abstract relayChainSpec: ChainSpecs<RelayApi>
  abstract peopleChainSpec: ChainSpecs<PeopleApi>

  abstract coreConsts: CoreConsts<RelayApi>
  abstract stakingConsts: StakingConsts<StakingApi>
}

// Default service returns the service itself, along with relay & people chain apis
export type DefaultService<T extends keyof ServiceType> = {
  Service: ServiceType[T]
  apis: [DedotClient<Service[T][0]>, DedotClient<Service[T][1]>]
}
