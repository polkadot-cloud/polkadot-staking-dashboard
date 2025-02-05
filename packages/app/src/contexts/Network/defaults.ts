// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList } from 'config/networks'
import type { NetworkContextInterface } from './types'

export const defaultNetworkContext: NetworkContextInterface = {
  network: NetworkList.polkadot.name,
  networkData: NetworkList.polkadot,
  switchNetwork: async () => new Promise((resolve) => resolve(undefined)),
}

export const defaultNetwork = 'polkadot'
