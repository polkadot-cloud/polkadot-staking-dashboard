// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
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
import { getEraRewardPoints } from '../query/eraRewardPoints'
import { ApiStatus } from '../spec/apiStatus'
import { ChainSpecs } from '../spec/chainSpecs'
import { ActiveEraQuery } from '../subscribe/activeEra'
import { PoolsConfigQuery } from '../subscribe/poolsConfig'
import { RelayMetricsQuery } from '../subscribe/relayMetrics'
import { StakingMetricsQuery } from '../subscribe/stakingMetrics'
import type { DefaultServiceClass } from '../types/serviceDefault'

export class WestendService
  implements DefaultServiceClass<WestendApi, WestendPeopleApi, WestendApi>
{
  relayChainSpec: ChainSpecs<WestendApi>
  peopleChainSpec: ChainSpecs<WestendPeopleApi>
  apiStatus: {
    relay: ApiStatus<WestendApi>
    people: ApiStatus<WestendPeopleApi>
  }
  coreConsts: CoreConsts<WestendApi>
  stakingConsts: StakingConsts<WestendApi>
  activeEra: ActiveEraQuery<WestendApi>
  relayMetrics: RelayMetricsQuery<WestendApi>
  poolsConfig: PoolsConfigQuery<WestendApi>
  stakingMetrics: StakingMetricsQuery<WestendApi>

  interface: ServiceInterface = {
    query: {
      eraRewardPoints: async (era: number) =>
        await getEraRewardPoints(this.apiRelay, era),
    },
  }

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId],
    public apiRelay: DedotClient<WestendApi>,
    public apiPeople: DedotClient<WestendPeopleApi>
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
