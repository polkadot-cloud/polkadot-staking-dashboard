// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { CoreConsts } from '../consts/core'
import { StakingConsts } from '../consts/staking'
import { ApiStatus } from '../spec/apiStatus'
import { ChainSpecs } from '../spec/chainSpecs'
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

    this.coreConsts.get()
    this.stakingConsts.get()
  }

  unsubscribe = async () => {
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
