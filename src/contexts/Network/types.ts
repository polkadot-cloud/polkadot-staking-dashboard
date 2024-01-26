// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Network, NetworkName } from 'types';

export interface NetworkState {
  name: NetworkName;
  meta: Network;
}

export interface NetworkContextInterface {
  network: NetworkName;
  networkData: Network;
  switchNetwork: (network: NetworkName) => void;
}
