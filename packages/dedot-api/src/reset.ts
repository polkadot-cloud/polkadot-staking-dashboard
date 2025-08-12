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
	resetFastUnstakeConfig,
	resetFastUnstakeQueue,
	resetPoolMemberships,
	resetPoolsConfig,
	resetProxies,
	resetRelayMetrics,
	resetServiceInterface,
	resetStakingLedgers,
	resetStakingMetrics,
} from 'global-bus'

export const onNetworkReset = () => {
	resetActivePools()
	resetActivePoolIds()

	resetAccountBalances()
	resetPoolMemberships()
	resetStakingLedgers()
	resetBonded()
	resetProxies()
	resetActiveProxy()

	resetBlockNumber()
	resetActiveEra()
	resetFastUnstakeConfig()
	resetFastUnstakeQueue()
	resetEraRewardPoints()

	resetApiStatus()
	resetRelayMetrics()
	resetStakingMetrics()
	resetPoolsConfig()
	resetServiceInterface()

	resetChainSpecs()
	resetConsts()
}
