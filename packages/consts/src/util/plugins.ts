// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Configuration } from '@polkawatch/ddp-client'
import type { NetworkId } from 'types'
import { NetworkList } from '../networks'
import { PolkawatchConfig } from '../plugins'

// Get subscan balance chain id by network
export const getSubscanBalanceChainId = (network: NetworkId) =>
	NetworkList[network].meta.subscanBalanceChainId

// Get polkawatch configuration for a given network
export const getPolkawatchConfig = (network: NetworkId): Configuration =>
	new Configuration({
		basePath: `https://${network}-${PolkawatchConfig.ApiVersion}-api.polkawatch.app`,
	})
