// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  KusamaAssetHubApi,
  PolkadotAssetHubApi,
  WestendAssetHubApi,
} from '@dedot/chaintypes'
import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { ChainConfig } from './chainConfig'

/**
 * Polkadot chain configuration
 * Uses relay chain for staking operations
 */
export const polkadotChainConfig: ChainConfig<
  PolkadotApi,
  PolkadotPeopleApi,
  PolkadotAssetHubApi,
  PolkadotApi
> = {
  getStakingApi: (apiRelay) => apiRelay,
  getCoreConstApi: (apiRelay) => apiRelay,

  queryApis: {
    erasValidatorRewardMulti: 'relay',
    bondedPool: 'relay',
    bondedPoolEntries: 'relay',
    erasStakersOverviewEntries: 'relay',
    erasStakersPagedEntries: 'relay',
    nominatorsMulti: 'relay',
    poolMembersMulti: 'relay',
    poolMetadataMulti: 'relay',
    proxies: 'relay',
    sessionValidators: 'relay',
    validatorEntries: 'relay',
    validatorsMulti: 'relay',
  },

  runtimeApis: {
    balanceToPoints: 'relay',
    pendingRewards: 'relay',
    pointsToBalance: 'relay',
  },

  txApis: {
    batch: 'relay',
    createPool: 'relay',
    fastUnstakeDeregister: 'relay',
    fastUnstakeRegister: 'relay',
    joinPool: 'relay',
    newNominator: 'relay',
    payoutStakersByPage: 'relay',
    poolBondExtra: 'relay',
    poolChill: 'relay',
    poolClaimCommission: 'relay',
    poolClaimPayout: 'relay',
    poolNominate: 'relay',
    poolSetClaimPermission: 'relay',
    poolSetCommission: 'relay',
    poolSetCommissionChangeRate: 'relay',
    poolSetCommissionMax: 'relay',
    poolSetMetadata: 'relay',
    poolSetState: 'relay',
    poolUnbond: 'relay',
    poolUpdateRoles: 'relay',
    poolWithdraw: 'relay',
    proxy: 'relay',
    setController: 'relay',
    stakingBondExtra: 'relay',
    stakingChill: 'relay',
    stakingNominate: 'relay',
    stakingRebond: 'relay',
    stakingSetPayee: 'relay',
    stakingUnbond: 'relay',
    stakingWithdraw: 'relay',
    transferKeepAlive: 'relay',
  },
}

/**
 * Kusama chain configuration
 * Uses relay chain for staking operations
 */
export const kusamaChainConfig: ChainConfig<
  KusamaApi,
  KusamaPeopleApi,
  KusamaAssetHubApi,
  KusamaApi
> = {
  getStakingApi: (apiRelay) => apiRelay,
  getCoreConstApi: (apiRelay) => apiRelay,

  queryApis: {
    erasValidatorRewardMulti: 'relay',
    bondedPool: 'relay',
    bondedPoolEntries: 'relay',
    erasStakersOverviewEntries: 'relay',
    erasStakersPagedEntries: 'relay',
    nominatorsMulti: 'relay',
    poolMembersMulti: 'relay',
    poolMetadataMulti: 'relay',
    proxies: 'relay',
    sessionValidators: 'relay',
    validatorEntries: 'relay',
    validatorsMulti: 'relay',
  },

  runtimeApis: {
    balanceToPoints: 'relay',
    pendingRewards: 'relay',
    pointsToBalance: 'relay',
  },

  txApis: {
    batch: 'relay',
    createPool: 'relay',
    fastUnstakeDeregister: 'relay',
    fastUnstakeRegister: 'relay',
    joinPool: 'relay',
    newNominator: 'relay',
    payoutStakersByPage: 'relay',
    poolBondExtra: 'relay',
    poolChill: 'relay',
    poolClaimCommission: 'relay',
    poolClaimPayout: 'relay',
    poolNominate: 'relay',
    poolSetClaimPermission: 'relay',
    poolSetCommission: 'relay',
    poolSetCommissionChangeRate: 'relay',
    poolSetCommissionMax: 'relay',
    poolSetMetadata: 'relay',
    poolSetState: 'relay',
    poolUnbond: 'relay',
    poolUpdateRoles: 'relay',
    poolWithdraw: 'relay',
    proxy: 'relay',
    setController: 'relay',
    stakingBondExtra: 'relay',
    stakingChill: 'relay',
    stakingNominate: 'relay',
    stakingRebond: 'relay',
    stakingSetPayee: 'relay',
    stakingUnbond: 'relay',
    stakingWithdraw: 'relay',
    transferKeepAlive: 'relay',
  },
}

/**
 * Westend chain configuration
 * Uses hub chain for staking operations (different from Polkadot/Kusama)
 */
export const westendChainConfig: ChainConfig<
  WestendApi,
  WestendPeopleApi,
  WestendAssetHubApi,
  WestendAssetHubApi
> = {
  getStakingApi: (apiRelay, apiPeople, apiHub) => apiHub,
  getCoreConstApi: (apiRelay) => apiRelay,

  queryApis: {
    erasValidatorRewardMulti: 'hub',
    bondedPool: 'hub',
    bondedPoolEntries: 'hub',
    erasStakersOverviewEntries: 'hub',
    erasStakersPagedEntries: 'hub',
    nominatorsMulti: 'hub',
    poolMembersMulti: 'hub',
    poolMetadataMulti: 'hub',
    proxies: 'hub',
    sessionValidators: 'hub',
    validatorEntries: 'hub',
    validatorsMulti: 'hub',
  },

  runtimeApis: {
    balanceToPoints: 'hub',
    pendingRewards: 'hub',
    pointsToBalance: 'hub',
  },

  txApis: {
    batch: 'hub',
    createPool: 'hub',
    fastUnstakeDeregister: 'hub',
    fastUnstakeRegister: 'hub',
    joinPool: 'hub',
    newNominator: 'hub',
    payoutStakersByPage: 'hub',
    poolBondExtra: 'hub',
    poolChill: 'hub',
    poolClaimCommission: 'hub',
    poolClaimPayout: 'hub',
    poolNominate: 'hub',
    poolSetClaimPermission: 'hub',
    poolSetCommission: 'hub',
    poolSetCommissionChangeRate: 'hub',
    poolSetCommissionMax: 'hub',
    poolSetMetadata: 'hub',
    poolSetState: 'hub',
    poolUnbond: 'hub',
    poolUpdateRoles: 'hub',
    poolWithdraw: 'hub',
    proxy: 'hub',
    setController: 'hub',
    stakingBondExtra: 'hub',
    stakingChill: 'hub',
    stakingNominate: 'hub',
    stakingRebond: 'hub',
    stakingSetPayee: 'hub',
    stakingUnbond: 'hub',
    stakingWithdraw: 'hub',
    transferKeepAlive: 'hub',
  },
}
