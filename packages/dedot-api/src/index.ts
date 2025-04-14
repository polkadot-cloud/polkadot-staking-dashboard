// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetwork, network$, rpcEndpoints$ } from 'global-bus'
import { getInitialNetwork, getInitialRpcEndpoints } from 'global-bus/util'
import { combineLatest, pairwise, startWith } from 'rxjs'
import { getDefaultService } from './start'
import type { ServiceClass } from './types'

// The active service
let service: ServiceClass

// Start service for the current network
export const initDedotService = async () => {
  // Subscribe to network and rpc endpoints changes
  //
  // TODO: Combine network, rpc / light client config into a single `networkConfig$` observable
  combineLatest([
    network$.pipe(startWith(getInitialNetwork()), pairwise()),
    rpcEndpoints$.pipe(
      startWith(getInitialRpcEndpoints(getNetwork())),
      pairwise()
    ),
  ]).subscribe(async ([[prevNetwork, network]]) => {
    // Unsubscribe from previous service if on new network config
    if (prevNetwork !== network) {
      service.unsubscribe()
    }

    // Type narrow services and apis
    if (network === 'westend') {
      const { Service, apis } = await getDefaultService<'westend'>(network)
      service = new Service(...apis)
    }
    if (network === 'kusama') {
      const { Service, apis } = await getDefaultService<'kusama'>(network)
      service = new Service(...apis)
    }
    if (network === 'polkadot') {
      const { Service, apis } = await getDefaultService<'polkadot'>(network)
      service = new Service(...apis)
    }

    // Start the service
    await service.start()
  })
}
