// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi, PolkadotApi, WestendApi } from '@dedot/chaintypes'
import type { KusamaAssetHubApi } from '@dedot/chaintypes/kusama-asset-hub'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { PolkadotAssetHubApi } from '@dedot/chaintypes/polkadot-asset-hub'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { WestendAssetHubApi } from '@dedot/chaintypes/westend-asset-hub'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { ServiceInterface } from 'types'
import type { KusamaService } from '../services/kusama'
import type { PolkadotService } from '../services/polkadot'
import type { WestendService } from '../services/westend'
import type { ActivePoolQuery } from '../subscribe/activePool'
import type { BondedQuery } from '../subscribe/bonded'
import type { PoolMembershipQuery } from '../subscribe/poolMembership'
import type { ProxiesQuery } from '../subscribe/proxies'
import type { StakingLedgerQuery } from '../subscribe/stakingLedger'

// All available chains
export type Chain =
  | PolkadotApi
  | PolkadotPeopleApi
  | PolkadotAssetHubApi
  | KusamaApi
  | KusamaPeopleApi
  | KusamaAssetHubApi
  | WestendApi
  | WestendPeopleApi
  | WestendAssetHubApi

// Relay chains
export type RelayChain = PolkadotApi | KusamaApi | WestendApi

// People chains
export type PeopleChain = PolkadotPeopleApi | KusamaPeopleApi | WestendPeopleApi

// Asset hub chains
export type AssetHubChain =
  | PolkadotAssetHubApi
  | KusamaAssetHubApi
  | WestendAssetHubApi

// Chains that are used for staking and nomination pools
export type StakingChain = PolkadotApi | KusamaApi | WestendAssetHubApi

// Mapping of service types for each network
export interface ServiceType {
  polkadot: typeof PolkadotService
  kusama: typeof KusamaService
  westend: typeof WestendService
}

// Mapping of the required chains for each service
export type Service = {
  polkadot: [PolkadotApi, PolkadotPeopleApi, PolkadotAssetHubApi]
  kusama: [KusamaApi, KusamaPeopleApi, KusamaAssetHubApi]
  westend: [WestendApi, WestendPeopleApi, WestendAssetHubApi]
}

// Generic service class that all services must implement
export abstract class ServiceClass {
  abstract interface: ServiceInterface

  abstract start(): Promise<void>
  abstract unsubscribe(): Promise<void>
}

// Bonded record
export type BondedAccounts<StakingApi extends StakingChain> = Record<
  string,
  BondedQuery<StakingApi>
>

// Staking ledgers record
export type StakingLedgers<StakingApi extends StakingChain> = Record<
  string,
  StakingLedgerQuery<StakingApi>
>

// Active pools record
export type ActivePools<StakingApi extends StakingChain> = Record<
  number,
  ActivePoolQuery<StakingApi>
>

// Pool Memberships record
export type PoolMemberships<StakingApi extends StakingChain> = Record<
  string,
  PoolMembershipQuery<StakingApi>
>

// Proxies record
export type Proxies<StakingApi extends StakingChain> = Record<
  string,
  ProxiesQuery<StakingApi>
>
