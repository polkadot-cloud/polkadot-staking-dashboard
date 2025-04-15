// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ConnectionType, NetworkId } from 'types'
import {
  setLocalConnectionType,
  setLocalNetwork,
  setLocalRpcEndpoints,
} from './local'
import { _networkConfig } from './private'

export const networkConfig$ = _networkConfig.asObservable()

export const setNetworkConfig = (
  network: NetworkId,
  rpcEndpoints: Record<string, string>,
  connectionType: ConnectionType
) => {
  setLocalNetwork(network)
  setLocalRpcEndpoints(network, rpcEndpoints)
  setLocalConnectionType(connectionType)
  _networkConfig.next({
    network,
    rpcEndpoints,
    connectionType,
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

export const getConnectionType = () => _networkConfig.getValue().connectionType

export const setConnectionType = (connectionType: ConnectionType) => {
  setLocalConnectionType(connectionType)
  _networkConfig.next({
    ..._networkConfig.getValue(),
    connectionType,
  })
}
