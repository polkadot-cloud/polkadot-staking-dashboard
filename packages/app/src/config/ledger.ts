// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import WestendIconSVG from 'assets/svg/chains/westendIcon.svg?react'
import KusamaSVG from 'assets/svg/ledger/kusama.svg?react'
import PolkadotSVG from 'assets/svg/ledger/polkadot.svg?react'
import type { LedgerChain } from 'contexts/LedgerHardware/types'

export const LedgerChains: LedgerChain[] = [
  {
    network: 'polkadot',
    txMetadataChainId: 'dot',
    Icon: PolkadotSVG,
  },
  {
    network: 'kusama',
    txMetadataChainId: 'ksm',
    Icon: KusamaSVG,
  },
  {
    network: 'westend',
    txMetadataChainId: 'dot',
    Icon: WestendIconSVG,
  },
]
