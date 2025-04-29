// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId } from 'types'

export interface NetworkContextInterface {
  network: NetworkId
  switchNetwork: (network: NetworkId) => Promise<void>
}
