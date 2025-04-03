// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { extractUrlValue, varToUrlHash } from '@w3ux/utils'
import type { NetworkId } from 'common-types'
import { NetworkList } from 'config/networks'
import { Apis } from 'controllers/Apis'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { defaultNetwork } from './defaults'
import type { NetworkContextInterface, NetworkState } from './types'

export const [NetworkContext, useNetwork] =
  createSafeContext<NetworkContextInterface>()

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  // Get the initial network and prepare meta tags if necessary
  const getInitialNetwork = () => {
    // First check for network in invite URL path
    const path = window.location.hash
    const inviteMatch = path.match(/#\/invite\/(pool|validator)\/([^/]+)/)
    if (inviteMatch) {
      const urlNetwork = inviteMatch[2] as NetworkId
      const urlNetworkValid = !!Object.values(NetworkList).find(
        (n) => n.name === urlNetwork
      )
      if (urlNetworkValid) {
        return urlNetwork
      }
    }

    // Then check URL parameter 'n'
    const urlNetworkRaw = extractUrlValue('n')
    const urlNetworkValid = !!Object.values(NetworkList).find(
      (n) => n.name === urlNetworkRaw
    )

    if (urlNetworkValid) {
      const urlNetwork = urlNetworkRaw as NetworkId
      return urlNetwork
    }

    // Then fallback to localStorage network if there
    const localNetwork: NetworkId = localStorage.getItem('network') as NetworkId
    const localNetworkValid = !!Object.values(NetworkList).find(
      (n) => n.name === localNetwork
    )

    return localNetworkValid ? localNetwork : defaultNetwork
  }

  // Store the initial active network
  const initialNetwork = getInitialNetwork()

  const [network, setNetwork] = useState<NetworkState>({
    name: initialNetwork,
    meta: NetworkList[initialNetwork],
    error: null,
  })

  // handle network switching
  const switchNetwork = async (
    name: NetworkId,
    saveToStorage: boolean = true
  ): Promise<void> => {
    // Disconnect from current APIs before switching network
    await Promise.all([
      await Apis.destroy(network.name),
      await Apis.destroy(`people-${network.name}`),
    ])

    // Only save to localStorage if explicitly requested (i.e., user-initiated network switch)
    if (saveToStorage) {
      localStorage.setItem('network', name)
    }

    setNetwork({
      name,
      meta: NetworkList[name],
      error: null,
    })

    // update url 'n' parameter if explicitly switching networks
    if (saveToStorage) {
      varToUrlHash('n', name, false)
    }
  }

  return (
    <NetworkContext.Provider
      value={{
        network: network.name,
        networkData: network.meta,
        networkError: network.error,
        switchNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
