// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, SystemChainId } from 'types'
import { NetworkList, SystemChainList } from './networks'
import { SupportedProxies } from './proxies'

// Check if proxy type is supported in the dashboard
export const isSupportedProxy = (proxy: string) =>
  Object.keys(SupportedProxies).includes(proxy) || proxy === 'Any'

// Check if proxy call is supported for a given proxy type
export const isSupportedProxyCall = (
  proxy: string,
  pallet: string,
  method: string
) => {
  if ([method, pallet].includes('undefined')) {
    return false
  }
  const call = `${pallet}.${method}`
  const calls = SupportedProxies[proxy]
  return (calls || []).find((c) => ['*', call].includes(c)) !== undefined
}

// Get network data from network list
export const getNetworkData = (network: NetworkId) => NetworkList[network]

// Get system chain data from network list
export const getSystemChainData = (chain: SystemChainId) =>
  SystemChainList[chain]

// Get default rpc endpoints for a relay chain and accompanying system chains for a given network
export const getDefaultRpcEndpoints = (network: NetworkId) => {
  const relayRpcs = NetworkList[network].endpoints.rpc
  const systemChains = Object.entries(SystemChainList).filter(
    ([, c]) => c.relayChain === network
  )

  // Take a random rpc endpoint for the relay chain
  const relayRpc =
    Object.keys(relayRpcs)[
      Math.floor(Math.random() * Object.keys(relayRpcs).length)
    ]

  const systemChainRpc = systemChains.reduce(
    (acc: Record<string, string>, [id, c]) => {
      const rpc = Object.keys(c.endpoints.rpc)[
        Math.floor(Math.random() * Object.keys(c.endpoints.rpc).length)
      ]
      acc[id] = rpc
      return acc
    },
    {}
  )

  return {
    [network]: relayRpc,
    ...systemChainRpc,
  }
}
