// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { varToUrlHash } from '@w3ux/utils'
import { NetworkList } from 'consts/networks'
import { Apis } from 'controllers/Apis'
import { getInitialNetwork } from 'global-bus/util'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { NetworkId } from 'types'
import type { NetworkContextInterface, NetworkState } from './types'

export const [NetworkContext, useNetwork] =
  createSafeContext<NetworkContextInterface>()

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
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
