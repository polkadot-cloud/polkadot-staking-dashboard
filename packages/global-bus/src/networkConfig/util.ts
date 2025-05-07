// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, localStorageOrDefault } from '@w3ux/utils'
import { NetworkKey, ProviderTypeKey, rpcEndpointKey } from 'consts'
import { DefaultNetwork, NetworkList, SystemChainList } from 'consts/networks'
import { getDefaultRpcEndpoints } from 'consts/util'
import type {
  NetworkConfig,
  NetworkId,
  ProviderType,
  RpcEndpoints,
} from 'types'
import { setLocalRpcEndpoints } from './local'

export const getInitialNetwork = () => {
  // Attempt to get network from URL
  const urlNetwork = extractUrlValue('n')
  const urlNetworkValid = !!Object.values(NetworkList).find(
    (n) => n.name === urlNetwork
  )

  // Use network from url if valid
  if (urlNetworkValid) {
    localStorage.setItem(NetworkKey, urlNetwork)
    return urlNetwork as NetworkId
  }

  // Fallback 1: Use network from local storage if valid
  const localNetwork: NetworkId = localStorage.getItem(NetworkKey) as NetworkId
  const localNetworkValid = !!Object.values(NetworkList).find(
    (n) => n.name === localNetwork
  )
  if (localNetworkValid) {
    localStorage.setItem(NetworkKey, localNetwork)
    return localNetwork
  }

  // Fallback 2: Use default network
  localStorage.setItem(NetworkKey, DefaultNetwork)
  return DefaultNetwork
}

export const getInitialRpcEndpoints = (network: NetworkId): RpcEndpoints => {
  // Validates local RPC endpoints by checking against the default values
  const validateRpcEndpoints = (a: object, b: object) => {
    const typeCheck =
      JSON.stringify(Object.keys(a).sort()) ===
        JSON.stringify(Object.keys(b).sort()) &&
      Object.values(a).every((v) => typeof v === 'string') &&
      Object.values(b).every((v) => typeof v === 'string')
    // Check if values are valid RPC keys
    const valueCheck = Object.entries(a).every(([k, v]) =>
      Object.keys(
        { ...NetworkList, ...SystemChainList }[k]?.endpoints?.rpc || []
      ).includes(v)
    )
    return typeCheck && valueCheck
  }

  const local = localStorageOrDefault<RpcEndpoints>(
    rpcEndpointKey(network),
    {},
    true
  ) as RpcEndpoints

  const fallback = getDefaultRpcEndpoints(network)
  if (local) {
    if (validateRpcEndpoints(local, fallback)) {
      return local
    }
  }
  setLocalRpcEndpoints(network, fallback)
  return fallback
}

export const getInitialProviderType = (): ProviderType => {
  const result = localStorage.getItem(ProviderTypeKey) || 'ws'
  if (['ws', 'sc'].includes(result)) {
    return result as ProviderType
  }
  return 'ws'
}

export const getInitialNetworkConfig = (): NetworkConfig => {
  const network = getInitialNetwork()
  const rpcEndpoints = getInitialRpcEndpoints(network)
  const providerType = getInitialProviderType()
  return {
    network,
    rpcEndpoints,
    providerType,
  }
}
