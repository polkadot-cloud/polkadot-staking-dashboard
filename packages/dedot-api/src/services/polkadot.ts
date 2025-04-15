// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'
import { CoreConsts } from '../consts/core'
import { StakingConsts } from '../consts/staking'
import { ChainSpecs } from '../spec/chainSpecs'
import type { DefaultServiceClass } from '../types'

// Define the types for the chains being used in this service
type RelayApi = PolkadotApi
type PeopleApi = PolkadotPeopleApi

// Define the types based on chain features
type BaseApi = PolkadotApi
type StakingApi = PolkadotApi

export class PolkadotService
  implements DefaultServiceClass<RelayApi, PeopleApi, BaseApi, StakingApi>
{
  relayChainSpec: ChainSpecs<RelayApi>
  peopleChainSpec: ChainSpecs<PeopleApi>
  coreConsts: CoreConsts<BaseApi>
  stakingConsts: StakingConsts<StakingApi>

  constructor(
    public apiRelay: DedotClient<RelayApi>,
    public apiPeople: DedotClient<PeopleApi>
  ) {
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
  }

  start = async () => {
    this.relayChainSpec = new ChainSpecs(this.apiRelay)
    this.peopleChainSpec = new ChainSpecs(this.apiPeople)
    this.coreConsts = new CoreConsts(this.apiRelay)
    this.stakingConsts = new StakingConsts(this.apiRelay)

    this.stakingConsts.get()

    // TODO: send consts and chain spec to UI.
  }

  unsubscribe = async () => {
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
