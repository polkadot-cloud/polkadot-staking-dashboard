// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type {
  AssetHubChain,
  PeopleChain,
  RelayChain,
  StakingChain,
} from '../types'

/**
 * Configuration that defines which APIs to use for different operations
 * for each network
 */
export interface ChainConfig<
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  HubApi extends AssetHubChain,
  StakingApi extends StakingChain,
> {
  // Which API to use for staking operations
  getStakingApi: (
    apiRelay: DedotClient<RelayApi>,
    apiPeople: DedotClient<PeopleApi>,
    apiHub: DedotClient<HubApi>
  ) => DedotClient<StakingApi>

  // Which API to use for core constants
  getCoreConstApi: (
    apiRelay: DedotClient<RelayApi>,
    apiPeople: DedotClient<PeopleApi>,
    apiHub: DedotClient<HubApi>
  ) => DedotClient<RelayApi>

  // API routing for query operations
  queryApis: {
    erasValidatorRewardMulti: 'relay' | 'hub'
    bondedPool: 'relay' | 'hub'
    bondedPoolEntries: 'relay' | 'hub'
    erasStakersOverviewEntries: 'relay' | 'hub'
    erasStakersPagedEntries: 'relay' | 'hub'
    nominatorsMulti: 'relay' | 'hub'
    poolMembersMulti: 'relay' | 'hub'
    poolMetadataMulti: 'relay' | 'hub'
    proxies: 'relay' | 'hub'
    sessionValidators: 'relay' | 'hub'
    validatorEntries: 'relay' | 'hub'
    validatorsMulti: 'relay' | 'hub'
  }

  // API routing for runtime API operations
  runtimeApis: {
    balanceToPoints: 'relay' | 'hub'
    pendingRewards: 'relay' | 'hub'
    pointsToBalance: 'relay' | 'hub'
  }

  // API routing for transaction operations
  txApis: {
    batch: 'relay' | 'hub'
    createPool: 'relay' | 'hub'
    fastUnstakeDeregister: 'relay' | 'hub'
    fastUnstakeRegister: 'relay' | 'hub'
    joinPool: 'relay' | 'hub'
    newNominator: 'relay' | 'hub'
    payoutStakersByPage: 'relay' | 'hub'
    poolBondExtra: 'relay' | 'hub'
    poolChill: 'relay' | 'hub'
    poolClaimCommission: 'relay' | 'hub'
    poolClaimPayout: 'relay' | 'hub'
    poolNominate: 'relay' | 'hub'
    poolSetClaimPermission: 'relay' | 'hub'
    poolSetCommission: 'relay' | 'hub'
    poolSetCommissionChangeRate: 'relay' | 'hub'
    poolSetCommissionMax: 'relay' | 'hub'
    poolSetMetadata: 'relay' | 'hub'
    poolSetState: 'relay' | 'hub'
    poolUnbond: 'relay' | 'hub'
    poolUpdateRoles: 'relay' | 'hub'
    poolWithdraw: 'relay' | 'hub'
    proxy: 'relay' | 'hub'
    setController: 'relay' | 'hub'
    stakingBondExtra: 'relay' | 'hub'
    stakingChill: 'relay' | 'hub'
    stakingNominate: 'relay' | 'hub'
    stakingRebond: 'relay' | 'hub'
    stakingSetPayee: 'relay' | 'hub'
    stakingUnbond: 'relay' | 'hub'
    stakingWithdraw: 'relay' | 'hub'
    transferKeepAlive: 'relay' | 'hub'
  }
}

// Helper function to get API based on routing configuration
export const getApiForOperation = <
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  HubApi extends AssetHubChain,
>(
  apiRelay: DedotClient<RelayApi>,
  apiPeople: DedotClient<PeopleApi>,
  apiHub: DedotClient<HubApi>,
  route: 'relay' | 'people' | 'hub'
) => {
  switch (route) {
    case 'relay':
      return apiRelay
    case 'people':
      return apiPeople
    case 'hub':
      return apiHub
    default:
      throw new Error(`Invalid API route: ${route}`)
  }
}
