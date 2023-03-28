// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerApp } from 'contexts/Hardware/types';
import { ReactComponent as KusamaSVG } from 'img/appIcons/kusama.svg';
import { ReactComponent as PolkadotSVG } from 'img/appIcons/polkadot.svg';

export const LedgerApps: Array<LedgerApp> = [
  {
    network: 'polkadot',
    appName: 'Polkadot',
    Icon: PolkadotSVG,
  },
  {
    network: 'kusama',
    appName: 'Kusama',
    Icon: KusamaSVG,
  },
];
