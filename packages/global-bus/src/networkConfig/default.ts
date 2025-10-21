// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkConfig } from 'types'
import { getInitialNetwork, getInitialProviderType } from './util'

export const defaultNetworkConfig: NetworkConfig = {
	network: getInitialNetwork(),
	rpcEndpoints: {},
	providerType: getInitialProviderType(),
}
