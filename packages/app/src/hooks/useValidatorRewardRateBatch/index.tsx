// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util/chains'
import { useEraStakers } from 'contexts/EraStakers'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useErasPerDay } from 'hooks/useErasPerDay'
import { useEffect, useState } from 'react'

// Calculates validator reward rates in a batch. If Staking API is enabled, rates are fetched from
// it, otherwise they are calculated from the previous era's data
export const useValidatorRewardRateBatch = (
	addresses: string[],
	pageKey: string,
) => {
	const { network } = useNetwork()
	const { erasPerDay } = useErasPerDay()
	const { pluginEnabled } = usePlugins()
	const { getActiveValidator } = useEraStakers()

	const { units } = getStakingChainData(network)

	// Store average reward rates, keyed by address
	const [rates, setRates] = useState<Record<string, number>>({})

	// Fetch average reward rate from previous era
	const getPrevEraAvgRewardRates = () => {
		// TODO Implement
	}

	// Fetch average reward rates from staking api
	const getAvgRewardRates = () => {
		// TODO: Implement
	}

	// Fetch performance queries when validator list changes
	useEffect(() => {
		if (pluginEnabled('staking_api')) {
			// Get validator avg reward rates from staking api
			getAvgRewardRates()
		} else {
			// Get validator avg reward rates from the previous era only
			getPrevEraAvgRewardRates()
		}
	}, [pageKey, pluginEnabled('staking_api')])

	return {
		rates,
	}
}
