// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList } from 'config/networks';

export const defaultNetworkContext = {
  network: NetworkList.polkadot.name,
  networkData: NetworkList.polkadot,
  switchNetwork: () => {},
};

export const defaultNetwork = 'polkadot';
