// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'
import { CoreConsts } from '../consts/core'
import { StakingConsts } from '../consts/staking'
import { ChainSpecs } from '../spec/chainSpecs'
import type { DefaultServiceClass } from '../types'

// Define the types based on chain features

export class PolkadotService
  implements DefaultServiceClass<PolkadotApi, PolkadotPeopleApi, PolkadotApi>
{
  relayChainSpec: ChainSpecs<PolkadotApi>
  peopleChainSpec: ChainSpecs<PolkadotPeopleApi>
  coreConsts: CoreConsts<PolkadotApi>
  stakingConsts: StakingConsts<PolkadotApi>

  constructor(
    public apiRelay: DedotClient<PolkadotApi>,
    public apiPeople: DedotClient<PolkadotPeopleApi>
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
  }

  unsubscribe = async () => {
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
