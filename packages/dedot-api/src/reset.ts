// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	resetAccountBalances,
	resetActiveEra,
	resetActivePoolIds,
	resetActivePools,
	resetActiveProxy,
	resetApiStatus,
	resetBlockNumber,
	resetBonded,
	resetChainSpecs,
	resetConsts,
	resetEraRewardPoints,
	resetPoolMemberships,
	resetPoolRoleIdentities,
	resetPoolsConfig,
	resetProxies,
	resetServiceInterface,
	resetStakingLedgers,
	resetStakingMetrics,
} from 'global-bus'

export const onNetworkReset = () => {
	resetActivePools()
	resetActivePoolIds()
	resetPoolRoleIdentities()

	resetAccountBalances()
	resetPoolMemberships()
	resetStakingLedgers()
	resetBonded()
	resetProxies()
	resetActiveProxy()

	resetBlockNumber()
	resetActiveEra()
	resetEraRewardPoints()

	resetApiStatus()
	resetStakingMetrics()
	resetPoolsConfig()
	resetServiceInterface()

	resetChainSpecs()
	resetConsts()
}
