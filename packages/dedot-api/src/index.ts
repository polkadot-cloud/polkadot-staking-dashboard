// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  getNetworkConfig,
  networkConfig$,
  setNetworkConfig,
  setServiceInterface,
} from 'global-bus'
import { getInitialNetworkConfig } from 'global-bus/util'
import { pairwise, startWith } from 'rxjs'
import { onNetworkReset } from './reset'
import { getDefaultService } from './start'
import type { ServiceClass } from './types'

// The active service
let service: ServiceClass

// Start service for the current network
export const initDedotService = async () => {
  // Populate network config with sanitized RPC endpoints
  const config = await getInitialNetworkConfig()
  setNetworkConfig(config.network, config.rpcEndpoints, config.providerType)

  // Subscribe to network config changes
  networkConfig$
    .pipe(startWith(getNetworkConfig()), pairwise())
    .subscribe(async ([prev, cur]) => {
      // Unsubscribe from previous service if on new network config, and clear stale global state
      if (
        prev.network !== cur.network ||
        prev.providerType !== cur.providerType
      ) {
        await service?.unsubscribe()
        onNetworkReset()
      }

      const { network, ...rest } = cur
      // Type narrow services and apis
      if (network === 'westend') {
        const { Service, apis, ids } = await getDefaultService(network, rest)
        service = new Service(cur, ids, ...apis)
      }
      if (network === 'kusama') {
        const { Service, apis, ids } = await getDefaultService(network, rest)
        service = new Service(cur, ids, ...apis)
      }
      if (network === 'polkadot') {
        const { Service, apis, ids } = await getDefaultService(network, rest)
        service = new Service(cur, ids, ...apis)
      }

      // Expose service interface
      setServiceInterface(service.interface)

      // Start the service
      await service.start()
    })
}
