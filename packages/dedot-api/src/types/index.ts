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
import type { ApiStatus } from 'types'
import type { KusamaService } from '../services/kusama'
import type { PolkadotService } from '../services/polkadot'
import type { WestendService } from '../services/westend'

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

// NOTE: Events not currently in use
export interface DisaptchEvent {
  apiStatus: ApiStatus
}
export type EventKey = keyof DisaptchEvent
