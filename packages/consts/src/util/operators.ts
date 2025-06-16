// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, OperatorsSupportedNetwork } from 'types'
import { NetworkList } from '../networks'

// Get whether the chain supports operators
export const isOperatorsSupported = (network: NetworkId): boolean =>
  NetworkList[network].meta.supportOperators

// Cast a network as an operator network, or return undefined
export const asOperatorsSupportedNetwork = (
  network: NetworkId
): OperatorsSupportedNetwork | undefined => {
  if (isOperatorsSupported(network)) {
    return network as OperatorsSupportedNetwork
  }
  return undefined
}
