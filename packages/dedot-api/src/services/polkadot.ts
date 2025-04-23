// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'
import { activeAddress$, setConsts, setMultiChainSpecs } from 'global-bus'
import type {
  NetworkConfig,
  NetworkId,
  ServiceInterface,
  SystemChainId,
} from 'types'
import { CoreConsts } from '../consts/core'
import { StakingConsts } from '../consts/staking'
import { bondedPool } from '../query/bondedPool'
import { bondedPoolEntries } from '../query/bondedPoolEntries'
import { erasStakersOverviewEntries } from '../query/erasStakersOverviewEntries'
import { erasStakersPagedEntries } from '../query/erasStakersPagedEntries'
import { paraSessionAccounts } from '../query/paraSessionAccounts'
import { proxies } from '../query/proxies'
import { sessionValidators } from '../query/sessionValidators'
import { validatorEntries } from '../query/validatorEntries'
import { balanceToPoints } from '../runtimeApi/balanceToPoints'
import { pendingRewards } from '../runtimeApi/pendingRewards'
import { pointsToBalance } from '../runtimeApi/pointsToBalance'
import { ApiStatus } from '../spec/apiStatus'
import { ChainSpecs } from '../spec/chainSpecs'
import { ActiveEraQuery } from '../subscribe/activeEra'
import { BlockNumberQuery } from '../subscribe/blockNumber'
import { EraRewardPointsQuery } from '../subscribe/eraRewardPoints'
import { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import { PoolsConfigQuery } from '../subscribe/poolsConfig'
import { RelayMetricsQuery } from '../subscribe/relayMetrics'
import { StakingMetricsQuery } from '../subscribe/stakingMetrics'
import type { DefaultServiceClass } from '../types/serviceDefault'

export class PolkadotService
  implements DefaultServiceClass<PolkadotApi, PolkadotPeopleApi, PolkadotApi>
{
  relayChainSpec: ChainSpecs<PolkadotApi>
  peopleChainSpec: ChainSpecs<PolkadotPeopleApi>
  apiStatus: {
    relay: ApiStatus<PolkadotApi>
    people: ApiStatus<PolkadotPeopleApi>
  }
  coreConsts: CoreConsts<PolkadotApi>
  stakingConsts: StakingConsts<PolkadotApi>
  blockNumber: BlockNumberQuery<PolkadotApi>
  activeEra: ActiveEraQuery<PolkadotApi>
  relayMetrics: RelayMetricsQuery<PolkadotApi>
  poolsConfig: PoolsConfigQuery<PolkadotApi>
  stakingMetrics: StakingMetricsQuery<PolkadotApi>
  eraRewardPoints: EraRewardPointsQuery<PolkadotApi>
  fastUnstakeConfig: FastUnstakeConfigQuery<PolkadotApi>

  interface: ServiceInterface = {
    query: {
      bondedPool: async (poolId) => await bondedPool(this.apiRelay, poolId),
      bondedPoolEntries: async () => await bondedPoolEntries(this.apiRelay),
      erasStakersOverviewEntries: async (era) =>
        await erasStakersOverviewEntries(this.apiRelay, era),
      erasStakersPagedEntries: async (era, validator) =>
        await erasStakersPagedEntries(this.apiRelay, era, validator),
      paraSessionAccounts: async (session) =>
        await paraSessionAccounts(this.apiRelay, session),
      proxies: async (address) => await proxies(this.apiRelay, address),
      sessionValidators: async () => await sessionValidators(this.apiRelay),
      validatorEntries: async () => await validatorEntries(this.apiRelay),
    },
    runtimeApi: {
      balanceToPoints: async (poolId, amount) =>
        await balanceToPoints(this.apiRelay, poolId, amount),
      pendingRewards: async (address) =>
        await pendingRewards(this.apiRelay, address),
      pointsToBalance: async (poolId, points) =>
        await pointsToBalance(this.apiRelay, poolId, points),
    },
  }

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId],
    public apiRelay: DedotClient<PolkadotApi>,
    public apiPeople: DedotClient<PolkadotPeopleApi>
  ) {
    this.ids = ids
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
    this.networkConfig = networkConfig
    this.apiStatus = {
      relay: new ApiStatus(this.apiRelay, ids[0], networkConfig),
      people: new ApiStatus(this.apiPeople, ids[1], networkConfig),
    }
  }

  start = async () => {
    this.relayChainSpec = new ChainSpecs(this.apiRelay)
    this.peopleChainSpec = new ChainSpecs(this.apiPeople)
    this.coreConsts = new CoreConsts(this.apiRelay)
    this.stakingConsts = new StakingConsts(this.apiRelay)

    await Promise.all([
      this.relayChainSpec.fetch(),
      this.peopleChainSpec.fetch(),
    ])
    setMultiChainSpecs({
      [this.ids[0]]: this.relayChainSpec.get(),
      [this.ids[1]]: this.peopleChainSpec.get(),
    })
    setConsts(this.ids[0], {
      ...this.coreConsts.get(),
      ...this.stakingConsts.get(),
    })

    this.blockNumber = new BlockNumberQuery(this.apiRelay)
    this.activeEra = new ActiveEraQuery(this.apiRelay)
    this.relayMetrics = new RelayMetricsQuery(this.apiRelay)
    this.poolsConfig = new PoolsConfigQuery(this.apiRelay)
    this.fastUnstakeConfig = new FastUnstakeConfigQuery(this.apiRelay)

    this.activeEra.activeEra$.subscribe(async ({ index }) => {
      if (index > 0) {
        this.stakingMetrics?.unsubscribe()
        this.stakingMetrics = new StakingMetricsQuery(this.apiRelay, index)
        this.eraRewardPoints?.unsubscribe()
        this.eraRewardPoints = new EraRewardPointsQuery(this.apiRelay, index)
      }
    })

    activeAddress$.subscribe((activeAddress) => {
      // TODO: Add subscriptions reliant upon activeAddress
      console.debug(activeAddress)
      // Unsubscribe, and then resubscribe only if active address !== null
    })
  }

  unsubscribe = async () => {
    this.activeEra.unsubscribe()
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
