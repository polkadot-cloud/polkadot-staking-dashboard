// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, ProviderType } from 'types'
import {
  setLocalNetwork,
  setLocalProviderType,
  setLocalRpcEndpoints,
} from './local'
import { _networkConfig } from './private'

export const networkConfig$ = _networkConfig.asObservable()

export const setNetworkConfig = (
  network: NetworkId,
  rpcEndpoints: Record<string, string>,
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

export const getNetwork = () => _networkConfig.getValue().network

export const setNetwork = (network: NetworkId) => {
  setLocalNetwork(network)
  _networkConfig.next({
    ..._networkConfig.getValue(),
    network,
  })
}

export const getRpcEndpoints = () => _networkConfig.getValue().rpcEndpoints

export const setRpcEndpoints = (
  network: NetworkId,
  rpcEndpoints: Record<string, string>
) => {
  setLocalRpcEndpoints(network, rpcEndpoints)
  _networkConfig.next({
    ..._networkConfig.getValue(),
    rpcEndpoints,
  })
}

export const getProviderType = () => _networkConfig.getValue().providerType

export const setProviderType = (providerType: ProviderType) => {
  setLocalProviderType(providerType)
  _networkConfig.next({
    ..._networkConfig.getValue(),
    providerType,
  })
}
