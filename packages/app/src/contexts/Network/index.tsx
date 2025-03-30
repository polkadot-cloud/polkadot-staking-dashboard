// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, varToUrlHash } from '@w3ux/utils'
import type { NetworkId } from 'common-types'
import { NetworkList } from 'config/networks'
import { Apis } from 'controllers/Apis'
import { createSafeContext } from 'hooks/useSafeContext'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { defaultNetwork } from './defaults'
import type { NetworkContextInterface, NetworkState } from './types'

export const [NetworkContext, useNetwork] =
  createSafeContext<NetworkContextInterface>()

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  // Get the initial network and prepare meta tags if necessary
  const getInitialNetwork = () => {
    const urlNetworkRaw = extractUrlValue('n')

    const urlNetworkValid = !!Object.values(NetworkList).find(
      (n) => n.name === urlNetworkRaw
    )

    // use network from url if valid
    if (urlNetworkValid) {
      const urlNetwork = urlNetworkRaw as NetworkId

      if (urlNetworkValid) {
        return urlNetwork
      }
    }
    // fallback to localStorage network if there
    const localNetwork: NetworkId = localStorage.getItem('network') as NetworkId

    const localNetworkValid = !!Object.values(NetworkList).find(
      (n) => n.name === localNetwork
    )

    const initialNetwork = localNetworkValid ? localNetwork : defaultNetwork

    // Commit initial to local storage
    localStorage.setItem('network', initialNetwork)

    return initialNetwork
  }

  // handle network switching
  const switchNetwork = async (name: NetworkId): Promise<void> => {
    // Disconnect from current APIs before switching network
    await Promise.all([
      await Apis.destroy(network.name),
      await Apis.destroy(`people-${network.name}`),
    ])

    setNetwork({
      name,
      meta: NetworkList[name],
    })

    // update url `n` if needed
    varToUrlHash('n', name, false)
  }

  // Store the initial active network
  const initialNetwork = getInitialNetwork()

  const [network, setNetwork] = useState<NetworkState>({
    name: initialNetwork,
    meta: NetworkList[initialNetwork],
  })

  return (
    <NetworkContext.Provider
      value={{
        network: network.name,
        networkData: network.meta,
        switchNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
