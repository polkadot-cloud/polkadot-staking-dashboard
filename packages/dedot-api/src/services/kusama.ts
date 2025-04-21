// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { DedotClient } from 'dedot'
import { setConsts, setMultiChainSpecs } from 'global-bus'
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
import { pointsToBalance } from '../runtimeApi/pointsToBalance'
import { ApiStatus } from '../spec/apiStatus'
import { ChainSpecs } from '../spec/chainSpecs'
import { ActiveEraQuery } from '../subscribe/activeEra'
import { PoolsConfigQuery } from '../subscribe/poolsConfig'
import { RelayMetricsQuery } from '../subscribe/relayMetrics'
import { StakingMetricsQuery } from '../subscribe/stakingMetrics'
import type { DefaultServiceClass } from '../types/serviceDefault'

export class KusamaService
  implements DefaultServiceClass<KusamaApi, KusamaPeopleApi, KusamaApi>
{
  relayChainSpec: ChainSpecs<KusamaApi>
  peopleChainSpec: ChainSpecs<KusamaPeopleApi>
  apiStatus: {
    relay: ApiStatus<KusamaApi>
    people: ApiStatus<KusamaPeopleApi>
  }
  coreConsts: CoreConsts<KusamaApi>
  stakingConsts: StakingConsts<KusamaApi>
  activeEra: ActiveEraQuery<KusamaApi>
  relayMetrics: RelayMetricsQuery<KusamaApi>
  poolsConfig: PoolsConfigQuery<KusamaApi>
  stakingMetrics: StakingMetricsQuery<KusamaApi>

  interface: ServiceInterface = {
    query: {
      bondedPool: async (poolId) => await bondedPool(this.apiRelay, poolId),
      bondedPoolEntries: async () => await bondedPoolEntries(this.apiRelay),
      erasStakersOverviewEntries: async (era) =>
        await erasStakersOverviewEntries(this.apiRelay, era),
      erasStakersPagedEntries: async (era, validator) =>
        await erasStakersPagedEntries(this.apiRelay, era, validator),
      paraSessionAccounts: async (session: number) =>
        await paraSessionAccounts(this.apiRelay, session),
      proxies: async (address: string) => await proxies(this.apiRelay, address),
      sessionValidators: async () => await sessionValidators(this.apiRelay),
      validatorEntries: async () => await validatorEntries(this.apiRelay),
    },
    runtimeApi: {
      pointsToBalance: async (poolId, points) =>
        await pointsToBalance(this.apiRelay, poolId, points),
    },
  }

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId],
    public apiRelay: DedotClient<KusamaApi>,
    public apiPeople: DedotClient<KusamaPeopleApi>
  ) {
    this.ids = ids
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
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

    this.activeEra = new ActiveEraQuery(this.apiRelay)
    this.relayMetrics = new RelayMetricsQuery(this.apiRelay)
    this.poolsConfig = new PoolsConfigQuery(this.apiRelay)

    this.activeEra.activeEra$.subscribe(async (era) => {
      if (era.index > 0) {
        this.stakingMetrics?.unsubscribe()
        this.stakingMetrics = new StakingMetricsQuery(this.apiRelay, era)
      }
    })
  }

  unsubscribe = async () => {
    this.activeEra.unsubscribe()
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
