// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rpcEndpointKey } from 'consts'
import type { NetworkId } from 'types'
import { _rpcEndpoints } from './private'

export const rpcEndpoints$ = _rpcEndpoints.asObservable()

export const getRpcEndpoints = () => _rpcEndpoints.getValue()

export const setRpcEndpoints = (
  network: NetworkId,
  endpoints: Record<string, string>
) => {
  localStorage.setItem(rpcEndpointKey(network), JSON.stringify(endpoints))
  _rpcEndpoints.next(endpoints)
}
