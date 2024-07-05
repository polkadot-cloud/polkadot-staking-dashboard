// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerChain } from 'contexts/LedgerHardware/types';
import KusamaSVG from 'img/appIcons/kusama.svg?react';
import PolkadotSVG from 'img/appIcons/polkadot.svg?react';

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
];
