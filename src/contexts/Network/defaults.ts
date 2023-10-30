// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList } from 'config/networks';

export const defaultNetworkContext = {
  network: NetworkList.polkadot.name,
  networkData: NetworkList.polkadot,
  switchNetwork: () => {},
};
