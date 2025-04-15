// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'

// All available chain types
export type ChainType =
  | PolkadotApi
  | PolkadotPeopleApi
  | KusamaApi
  | KusamaPeopleApi
  | WestendApi
  | WestendPeopleApi

// Relay chain types
export type RelayChainType = PolkadotApi | KusamaApi | WestendApi

// People chain types
export type PeopleChainType =
  | PolkadotPeopleApi
  | KusamaPeopleApi
  | WestendPeopleApi

// Chains that are used for staking and nomination pools
export type StakingChainType = PolkadotApi | KusamaApi | WestendApi
