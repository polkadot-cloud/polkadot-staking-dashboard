// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { DedotClient } from 'dedot'
import type { ServiceClass } from '../types'

export class KusamaService implements ServiceClass {
  constructor(
    public apiRelay: DedotClient<KusamaApi>,
    public apiPeople: DedotClient<KusamaPeopleApi>
  ) {
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
  }

  start = async () => {
    console.log('Starting Kusama service')
  }

  unsubscribe = async () => {
    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }
}
