// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { KusamaKnownPoolIds, PolkadotKnownPoolIds } from '../pools'

export const getNetworkKnownPoolIds = (network: string): number[] => {
	switch (network) {
		case 'polkadot':
			return PolkadotKnownPoolIds
		case 'kusama':
			return KusamaKnownPoolIds
		default:
			return []
	}
}
