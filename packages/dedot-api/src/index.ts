// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { network$ } from 'global-bus'
import { kusamaService } from './services/kusama'
import { polkadotService } from './services/polkadot'
import { westendService } from './services/westend'
import { startDefaultService } from './start'

// Start api service for the current network
export const initDedotService = async () => {
  network$.subscribe(async (network) => {
    switch (network) {
      case 'westend':
        await startDefaultService(network, westendService)
        break
      case 'kusama':
        await startDefaultService(network, kusamaService)
        break

      // Default to polkadot if no other network is specified
      default:
        await startDefaultService(network, polkadotService)
    }
  })
}
