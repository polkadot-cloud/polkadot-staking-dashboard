// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'

import type { DedotClient } from 'dedot'

// All available chain types
export type ChainTypes =
  | PolkadotApi
  | PolkadotPeopleApi
  | KusamaApi
  | KusamaPeopleApi
  | WestendApi
  | WestendPeopleApi

// Mapping of the required chain types for each network
export type ServiceApiMap = {
  polkadot: [PolkadotApi, PolkadotPeopleApi]
  kusama: [KusamaApi, KusamaPeopleApi]
  westend: [WestendApi, WestendPeopleApi]
}

// A default service requires Relay chain and People chain
export type DefaultServiceCallback<
  RelayApi extends ChainTypes,
  PeopleApi extends ChainTypes,
> = (
  apiRelay: DedotClient<RelayApi>,
  apiPeople: DedotClient<PeopleApi>
) => Promise<void>
