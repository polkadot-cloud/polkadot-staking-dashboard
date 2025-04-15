// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { DedotClient } from 'dedot'
import type { CoreConsts } from './consts/core'
import type { StakingConsts } from './consts/staking'
import type { KusamaService } from './services/kusama'
import type { PolkadotService } from './services/polkadot'
import type { WestendService } from './services/westend'
import type { ChainSpecs } from './spec/chainSpecs'

// All available chain types
export type ChainType =
  | PolkadotApi
  | PolkadotPeopleApi
  | KusamaApi
  | KusamaPeopleApi
  | WestendApi
  | WestendPeopleApi

// Chains that are used for staking and nomination pools
export type StakingChainType = PolkadotApi | KusamaApi | WestendApi

// Base / Relay chain types
export type BaseChainType = PolkadotApi | KusamaApi | WestendApi

// All available service types
export interface ServiceType {
  polkadot: typeof PolkadotService
  kusama: typeof KusamaService
  westend: typeof WestendService
}

// Mapping of the required chain types for each network
export type ServiceApis = {
  polkadot: [PolkadotApi, PolkadotPeopleApi]
  kusama: [KusamaApi, KusamaPeopleApi]
  westend: [WestendApi, WestendPeopleApi]
}

// A default service requires Relay chain and People chain
export type DefaultServiceCallback<
  RelayApi extends ChainType,
  PeopleApi extends ChainType,
> = (
  apiRelay: DedotClient<RelayApi>,
  apiPeople: DedotClient<PeopleApi>
) => Promise<void>

// A base service class that all services should implement
export abstract class DefaultServiceClass<
  RelayApi extends BaseChainType,
  PeopleApi extends ChainType,
  BaseApi extends BaseChainType,
  StakingApi extends StakingChainType,
> {
  abstract relayChainSpec: ChainSpecs<RelayApi>
  abstract peopleChainSpec: ChainSpecs<PeopleApi>

  abstract coreConsts: CoreConsts<BaseApi>
  abstract stakingConsts: StakingConsts<StakingApi>

  abstract start(): Promise<void>
  abstract unsubscribe(): Promise<void>
}
