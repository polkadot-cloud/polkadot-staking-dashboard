// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Network, NetworkId } from 'common-types'

export interface NetworkState {
  name: NetworkId
  meta: Network
  error: string | null
}

export interface NetworkContextInterface {
  network: NetworkId
  networkData: Network
  networkError: string | null
  switchNetwork: (network: NetworkId) => Promise<void>
}
