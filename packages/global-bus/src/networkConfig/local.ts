// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  NetworkKey,
  ProviderTypeKey,
  rpcEndpointKey,
  rpcHealthCacheKey,
} from 'consts'
import type { RpcEndpointChainHealth } from 'plugin-staking-api/types'
import type { NetworkId, ProviderType, RpcEndpoints } from 'types'

export const setLocalNetwork = (network: NetworkId) => {
  localStorage.setItem(NetworkKey, network)
}

export const setLocalRpcEndpoints = (
  network: NetworkId,
  rpcEndpoints: RpcEndpoints
) => {
  localStorage.setItem(rpcEndpointKey(network), JSON.stringify(rpcEndpoints))
}

export const setLocalProviderType = (providerType: ProviderType) => {
  localStorage.setItem(ProviderTypeKey, providerType)
}

// Cache structure for RPC health data
interface RpcHealthCache {
  timestamp: number
  data: RpcEndpointChainHealth
}

// Set cached RPC health data with timestamp
export const setLocalRpcHealthCache = (
  network: NetworkId,
  healthData: RpcEndpointChainHealth
) => {
  const cache: RpcHealthCache = {
    timestamp: Date.now(),
    data: healthData,
  }
  localStorage.setItem(rpcHealthCacheKey(network), JSON.stringify(cache))
}

// Get cached RPC health data if it's within 1 hour
export const getLocalRpcHealthCache = (
  network: NetworkId
): RpcEndpointChainHealth | null => {
  try {
    const cached = localStorage.getItem(rpcHealthCacheKey(network))
    if (!cached) {
      return null
    }

    const cache: RpcHealthCache = JSON.parse(cached)
    const now = Date.now()
    const oneHourInMs = 60 * 60 * 1000 // 1 hour in milliseconds

    // Check if cache is still valid (within 1 hour)
    if (now - cache.timestamp < oneHourInMs) {
      return cache.data
    }

    // Cache is expired, remove it
    localStorage.removeItem(rpcHealthCacheKey(network))
    return null
  } catch (error) {
    // Invalid cache data, remove it
    localStorage.removeItem(rpcHealthCacheKey(network))
    return null
  }
}
