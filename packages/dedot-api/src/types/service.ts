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
import type { PeopleChainType, RelayChainType, StakingChainType } from '.'
import type { CoreConsts } from '../consts/core'
import type { StakingConsts } from '../consts/staking'
import type { KusamaService } from '../services/kusama'
import type { PolkadotService } from '../services/polkadot'
import type { WestendService } from '../services/westend'
import type { ChainSpecs } from '../spec/chainSpecs'

// Mapping of service types for each network
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

// Default service - requires a Relay chain and People chain
export type DefaultServiceCallback<
  RelayApi extends RelayChainType,
  PeopleApi extends PeopleChainType,
> = (
  apiRelay: DedotClient<RelayApi>,
  apiPeople: DedotClient<PeopleApi>
) => Promise<void>

// Default service class that all services should implement
export abstract class ServiceClass {
  abstract start(): Promise<void>
  abstract unsubscribe(): Promise<void>
}
export abstract class DefaultServiceClass<
  RelayApi extends RelayChainType,
  PeopleApi extends PeopleChainType,
  StakingApi extends StakingChainType,
> extends ServiceClass {
  abstract relayChainSpec: ChainSpecs<RelayApi>
  abstract peopleChainSpec: ChainSpecs<PeopleApi>

  abstract coreConsts: CoreConsts<RelayApi>
  abstract stakingConsts: StakingConsts<StakingApi>
}
