// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { varToUrlHash } from '@w3ux/utils'
import { NetworkList } from 'consts/networks'
import { Apis } from 'controllers/Apis'
import { getNetwork, network$, setNetwork } from 'global-bus'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { NetworkId } from 'types'
import type { NetworkContextInterface, NetworkState } from './types'

export const [NetworkContext, useNetwork] =
  createSafeContext<NetworkContextInterface>()

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  // Store the active network in state
  const [network, setNetworkState] = useState<NetworkState>({
    name: getNetwork(),
    meta: NetworkList[getNetwork()],
  })

  // handle network switching
  const switchNetwork = async (name: NetworkId): Promise<void> => {
    // Disconnect from current APIs before switching network
    await Promise.all([
      await Apis.destroy(network.name),
      await Apis.destroy(`people-${network.name}`),
    ])
    setNetwork(name)
    varToUrlHash('n', name, false)
  }

  // Subscribe to global bus network changes
  useEffect(() => {
    const sub = network$.subscribe((n) => {
      setNetworkState({
        name: n,
        meta: NetworkList[n],
      })
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])

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
