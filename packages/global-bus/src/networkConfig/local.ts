// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ConnectionTypeKey, NetworkKey, rpcEndpointKey } from 'consts'
import type { ConnectionType, NetworkId } from 'types'

export const setLocalNetwork = (network: NetworkId) => {
  localStorage.setItem(NetworkKey, network)
}

export const setLocalRpcEndpoints = (
  network: NetworkId,
  rpcEndpoints: Record<string, string>
) => {
  localStorage.setItem(rpcEndpointKey(network), JSON.stringify(rpcEndpoints))
}

export const setLocalConnectionType = (connectionType: ConnectionType) => {
  localStorage.setItem(ConnectionTypeKey, connectionType)
}
