// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { DedotClient } from 'dedot'
import type { ServiceClass } from '../types'

export class WestendService implements ServiceClass {
  constructor(
    public apiRelay: DedotClient<WestendApi>,
    public apiPeople: DedotClient<WestendPeopleApi>
  ) {
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
  }

  start = async () => {
    console.log('Starting Westend service')
  }

  unsubscribe = async () => {
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
