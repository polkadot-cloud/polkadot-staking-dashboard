// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, ProviderType, RpcEndpoints } from 'types'
import {
  setLocalNetwork,
  setLocalProviderType,
  setLocalRpcEndpoints,
} from './local'
import { _networkConfig } from './private'

export const networkConfig$ = _networkConfig.asObservable()

export const getNetworkConfig = () => _networkConfig.getValue()

export const setNetworkConfig = (
  network: NetworkId,
  rpcEndpoints: RpcEndpoints,
  providerType: ProviderType
) => {
  setLocalNetwork(network)
  setLocalRpcEndpoints(network, rpcEndpoints)
  setLocalProviderType(providerType)
  _networkConfig.next({
    network,
    rpcEndpoints,
    providerType,
  })
}

export const getNetwork = () => getNetworkConfig().network

export const setNetwork = (network: NetworkId) => {
  setLocalNetwork(network)
  _networkConfig.next({
    ...getNetworkConfig(),
    network,
  })
}

export const getRpcEndpoints = () => getNetworkConfig().rpcEndpoints

export const setRpcEndpoints = (
  network: NetworkId,
  rpcEndpoints: RpcEndpoints
) => {
  setLocalRpcEndpoints(network, rpcEndpoints)
  _networkConfig.next({
    ...getNetworkConfig(),
    rpcEndpoints,
  })
}

export const getProviderType = () => getNetworkConfig().providerType

export const setProviderType = (providerType: ProviderType) => {
  setLocalProviderType(providerType)
  _networkConfig.next({
    ...getNetworkConfig(),
    providerType,
  })
}
