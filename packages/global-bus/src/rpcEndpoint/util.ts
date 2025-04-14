// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import { rpcEndpointKey } from 'consts'
import { getDefaultRpcEndpoints } from 'consts/util'
import type { NetworkId } from 'types'

// Gets the initial RPC endpoints for a given network. Falls back to default endpoints if local
// endpoints are invalid
export const getInitialRpcEndpoints = (
  network: NetworkId
): Record<string, string> => {
  const local = localStorageOrDefault<Record<string, string>>(
    rpcEndpointKey(network),
    {},
    true
  ) as Record<string, string>

  const fallback = getDefaultRpcEndpoints(network)
  if (local) {
    if (validateRpcEndpoints(local, fallback)) {
      return local
    }
  }
  return fallback
}

// Validates the RPC endpoints by checking against the default values
const validateRpcEndpoints = (a: object, b: object) =>
  JSON.stringify(Object.keys(a).sort()) ===
    JSON.stringify(Object.keys(b).sort()) &&
  Object.values(a).every((v) => typeof v === 'string') &&
  Object.values(b).every((v) => typeof v === 'string')
