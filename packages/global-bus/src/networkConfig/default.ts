// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DefaultNetwork } from 'consts/networks'
import { getInitialProviderType } from './util'

export const defaultNetworkConfig = {
  network: DefaultNetwork,
  rpcEndpoints: {},
  providerType: getInitialProviderType(),
}
