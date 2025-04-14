// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'
import type { ServiceClass } from '../types'

export class PolkadotService implements ServiceClass {
  constructor(
    public apiRelay: DedotClient<PolkadotApi>,
    public apiPeople: DedotClient<PolkadotPeopleApi>
  ) {
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
  }

  start = async () => {
    console.log('Starting Polkadot service')
  }

  unsubscribe = async () => {
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
