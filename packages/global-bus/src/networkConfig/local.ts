// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkKey, ProviderTypeKey, rpcEndpointKey } from 'consts'
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
