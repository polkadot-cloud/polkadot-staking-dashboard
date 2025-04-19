// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  networkConfig$,
  resetActiveEra,
  resetApiStatus,
  resetChainSpecs,
  resetConsts,
  resetPoolsConfig,
  resetRelayMetrics,
  resetStakingMetrics,
} from 'global-bus'
import { getInitialNetworkConfig } from 'global-bus/util'
import { pairwise, startWith } from 'rxjs'
import { getDefaultService } from './start'
import type { ServiceClass } from './types'

// The active service
let service: ServiceClass

// Start service for the current network
export const initDedotService = async () => {
  // Subscribe to network config changes
  networkConfig$
    .pipe(startWith(getInitialNetworkConfig()), pairwise())
    .subscribe(async ([prev, cur]) => {
      // Unsubscribe from previous service if on new network config, and clear stale global state
      if (
        prev.network !== cur.network ||
        prev.providerType !== cur.providerType
      ) {
        await service.unsubscribe()
        resetActiveEra()
        resetApiStatus()
        resetChainSpecs()
        resetConsts()
        resetRelayMetrics()
        resetPoolsConfig()
        resetStakingMetrics()
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

      // Start the service
      await service.start()
    })
}
