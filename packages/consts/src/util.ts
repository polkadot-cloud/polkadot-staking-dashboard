// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, Networks, SystemChainId } from 'types'
import {
  NetworkList,
  ProductionDisabledNetworks,
  SystemChainList,
} from './networks'
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
export const getRelayChainData = (network: NetworkId) => NetworkList[network]

export const getSystemChainData = (chain: SystemChainId) =>
  SystemChainList[chain]

// Get staking chain data from either network list or system chain list
export const getStakingChainData = (network: NetworkId) => {
  const relayChainData = NetworkList[network]
  const stakingChain = relayChainData.meta.stakingChain

  if (stakingChain === network) {
    return relayChainData
  }
  if (Object.keys(SystemChainList).includes(stakingChain)) {
    return SystemChainList[stakingChain]
  }
  // NOTE: fallback - should not happen
  return relayChainData
}

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

// Get asset hub chain id from network id
export const getHubChainId = (network: NetworkId) => {
  if (network === 'westend') {
    return 'westmint'
  }
  if (network === 'kusama') {
    return 'statemine'
  }
  return 'statemint'
}

// Gets enabled networks depending on environment
export const getEnabledNetworks = (): Networks =>
  Object.entries(NetworkList).reduce((acc: Networks, [key, item]) => {
    if (
      !(
        import.meta.env.PROD &&
        ProductionDisabledNetworks.includes(key as NetworkId)
      )
    ) {
      acc[key] = item
    }
    return acc
  }, {})

// Checks if a network is enabled
export const isNetworkEnabled = (network: NetworkId) =>
  Object.keys(getEnabledNetworks()).includes(network)

// Get default staking chain for a network
export const getStakingChain = (network: NetworkId) =>
  NetworkList[network].meta.stakingChain

// Get subscan balance chain id by network
export const getSubscanBalanceChainId = (network: NetworkId) =>
  NetworkList[network].meta.subscanBalanceChainId
