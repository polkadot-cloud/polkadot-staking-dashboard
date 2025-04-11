// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { DefaultNetwork, NetworkList } from 'consts/networks'
import type { NetworkId } from 'types'

// Get the initial network to connect to
export const getInitialNetwork = () => {
  // Attempt to get network from URL
  const urlNetwork = extractUrlValue('n')
  const urlNetworkValid = !!Object.values(NetworkList).find(
    (n) => n.name === urlNetwork
  )

  // Use network from url if valid
  if (urlNetworkValid) {
    localStorage.setItem('network', urlNetwork)
    return urlNetwork as NetworkId
  }

  // Fallback 1: Use network from local storage if valid
  const localNetwork: NetworkId = localStorage.getItem('network') as NetworkId
  const localNetworkValid = !!Object.values(NetworkList).find(
    (n) => n.name === localNetwork
  )
  if (localNetworkValid) {
    localStorage.setItem('network', localNetwork)
    return localNetwork
  }

  // Fallback 2: Use default network
  localStorage.setItem('network', DefaultNetwork)
  return DefaultNetwork
}
