// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { networkConfig$ } from 'global-bus'
import { getInitialNetworkConfig } from 'global-bus/util'
import { pairwise, startWith } from 'rxjs'
import { getDefaultService } from './start'
import type { ServiceClass } from './types/service'

// The active service
let service: ServiceClass

// Start service for the current network
export const initDedotService = async () => {
  // Subscribe to network config changes
  networkConfig$
    .pipe(startWith(getInitialNetworkConfig()), pairwise())
    .subscribe(async ([prev, cur]) => {
      // Unsubscribe from previous service if on new network config
      if (
        prev.network !== cur.network ||
        prev.providerType !== cur.providerType
      ) {
        await service.unsubscribe()
      }

      const { network, ...rest } = cur
      // Type narrow services and apis
      if (network === 'westend') {
        const { Service, apis } = await getDefaultService(network, rest)
        service = new Service(...apis)
      }
      if (network === 'kusama') {
        const { Service, apis } = await getDefaultService(network, rest)
        service = new Service(...apis)
      }
      if (network === 'polkadot') {
        const { Service, apis } = await getDefaultService(network, rest)
        service = new Service(...apis)
      }

      // Start the service
      await service.start()
    })
}
