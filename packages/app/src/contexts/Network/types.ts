// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Network, NetworkId } from 'types';

export interface NetworkState {
  name: NetworkId;
  meta: Network;
}

export interface NetworkContextInterface {
  network: NetworkId;
  networkData: Network;
  switchNetwork: (network: NetworkId) => Promise<void>;
}
