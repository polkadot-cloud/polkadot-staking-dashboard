// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerChain } from 'contexts/LedgerHardware/types'

export const LedgerChains: LedgerChain[] = [
  {
    network: 'polkadot',
    txMetadataChainId: 'dot',
  },
  {
    network: 'kusama',
    txMetadataChainId: 'ksm',
  },
]
