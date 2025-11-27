// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util/chains'
import { useApi } from 'contexts/Api'
import { useEraStakers } from 'contexts/EraStakers'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useErasPerDay } from 'hooks/useErasPerDay'
import { useEffect, useState } from 'react'
import {
	calculateValidatorEraRewardRate,
	calculteValidatorEraTotalReward,
} from 'utils'

// Calculates validator reward rates in a batch. If Staking API is enabled, rates are fetched from
// it, otherwise they are calculated from the previous era's data
export const useValidatorRewardRateBatch = (
	addresses: string[],
	pageKey: string,
) => {
	const { network } = useNetwork()
	const { erasPerDay } = useErasPerDay()
	const { pluginEnabled } = usePlugins()
	const { prevEraReward } = useEraStakers()
	const { activeEra, serviceApi, isReady } = useApi()
	const { units } = getStakingChainData(network)

	// Store average reward rates, keyed by address
	const [rates, setRates] = useState<Record<string, Record<string, number>>>({})

	// Fetch average reward rate from previous era
	const getPrevEraAvgRewardRates = async (key: string) => {
		if (
			!isReady ||
			!prevEraReward?.payout ||
			!prevEraReward.points?.total ||
			activeEra.index === 0
		) {
			return
		}
		const prevEra = activeEra.index - 1

		// Fetch all overviews data in parallel
		const stakersOverviewPromises = addresses.map((address) =>
			serviceApi.query.erasStakersOverview(prevEra, address),
		)
		const stakersOverviewResults = await Promise.all(stakersOverviewPromises)
		const newRates: Record<string, number> = {}
		for (let i = 0; i < addresses.length; i++) {
			const address = addresses[i]
			const totalStake = stakersOverviewResults[i]?.total || 0n

			let rate = 0
			if (totalStake > 0n) {
				const totalReward = await calculteValidatorEraTotalReward(
					prevEra,
					address,
					serviceApi,
					prevEraReward.points,
				)
				rate = calculateValidatorEraRewardRate(
					erasPerDay,
					totalStake,
					totalReward,
					units,
				)
			}
			newRates[address] = rate
		}

		setRates({
			...rates,
			[key]: newRates,
		})
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
			getPrevEraAvgRewardRates(pageKey)
		}
	}, [
		isReady,
		pageKey,
		pluginEnabled('staking_api'),
		prevEraReward?.points?.total,
		activeEra.index,
	])

	return {
		rates,
	}
}
