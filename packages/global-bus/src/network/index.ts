// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkKey } from 'consts'
import type { NetworkId } from 'types'
import { _network } from './private'

export const network$ = _network.asObservable()

export const getNetwork = () => _network.getValue()

export const setNetwork = (network: NetworkId) => {
  localStorage.setItem(NetworkKey, network)
  _network.next(network)
}
