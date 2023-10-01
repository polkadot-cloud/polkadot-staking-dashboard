// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Network, NetworkName } from 'types';

export interface NetworkContextInterface {
  networkData: Network;
  switchNetwork: (network: NetworkName) => void;
}
