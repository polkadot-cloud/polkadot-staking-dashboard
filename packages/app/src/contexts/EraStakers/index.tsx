// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { removeSyncing, setSyncing } from 'global-bus'
import { fetchEraTotalNominators } from 'plugin-staking-api'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import type { ErasStakersOverviewEntries } from 'types'
import Worker from 'workers/stakers?worker'
import type { ProcessExposuresResponse } from 'workers/types'
import { useApi } from '../Api'
import { defaultEraStakers } from './defaults'
import type { EraStakers, EraStakersContextInterface, Exposure } from './types'
import { getLocalEraExposures, setLocalEraExposures } from './util'

const worker = new Worker()

export const [EraStakersContext, useEraStakers] =
	createSafeContext<EraStakersContextInterface>()

export const EraStakersProvider = ({ children }: { children: ReactNode }) => {
	const { network } = useNetwork()
	const { pluginEnabled } = usePlugins()
	const { activeAddress } = useActiveAccounts()
	const { isReady, activeEra, getApiStatus, serviceApi } = useApi()
	const { units } = getStakingChainData(network)

	// Store eras stakers in state
	const [eraStakers, setEraStakers] = useState<EraStakers>(defaultEraStakers)
	const eraStakersRef = useRef(eraStakers)

	// Store the total active nominators
	const [activeNominatorsCount, setActiveNominatorsCount] = useState<number>(0)

	// Store active validators
	const [activeValidators, setActiveValidators] = useState<number>(0)

	worker.onmessage = (message: MessageEvent) => {
		if (message) {
			const { data }: { data: ProcessExposuresResponse } = message
			const { task, networkName, era } = data

			// Ensure task matches, & era is still the same
			if (
				task !== 'processExposures' ||
				networkName !== network ||
				era !== activeEra.index.toString()
			) {
				return
			}

			const { stakers, activeAccountOwnStake, who } = data

			// Check if account hasn't changed since worker started
			if (activeAddress === who) {
				// Syncing current eraStakers is now complete
				removeSyncing('era-stakers')
				setStateWithRef(
					{
						...eraStakersRef.current,
						stakers,
						activeAccountOwnStake,
					},
					setEraStakers,
					eraStakersRef,
				)
			}
		}
	}

	// Fetches erasStakers exposures for an era, and saves to `localStorage`
	const fetchEraStakers = async (era: string) => {
		if (!isReady || activeEra.index === 0) {
			return []
		}
		// Fetch current era overviews
		const overviews = await serviceApi.query.erasStakersOverviewEntries(
			activeEra.index,
		)
		// Commit active nominator count from overviews if staking API is disabled
		if (!pluginEnabled('staking_api')) {
			const totalNominators = overviews.reduce(
				(prev, [, { nominatorCount }]) => prev + nominatorCount,
				0,
			)
			setActiveNominatorsCount(totalNominators)
		}

		let exposures: Exposure[] = []
		const localExposures = getLocalEraExposures(
			network,
			era,
			activeEra.index.toString(),
		)
		if (localExposures) {
			exposures = localExposures
		} else {
			exposures = await getPagedErasStakers(era, overviews)
		}

		// For resource limitation concerns, only store the current era in local storage
		if (era === activeEra.index.toString()) {
			setLocalEraExposures(network, era, exposures)
		}
		return exposures
	}

	// Fetches the active nominator set and metadata around it
	const fetchActiveEraStakers = async () => {
		if (!isReady || activeEra.index === 0) {
			return
		}
		setSyncing('era-stakers')

		const exposures = await fetchEraStakers(activeEra.index.toString())

		setActiveValidators(exposures.length)

		// Worker to calculate stats
		worker.postMessage({
			era: activeEra.index.toString(),
			networkName: network,
			task: 'processExposures',
			activeAccount: activeAddress,
			units,
			exposures,
		})
	}

	// Fetch eras stakers from storage
	const getPagedErasStakers = async (
		era: string,
		overviews: ErasStakersOverviewEntries,
	) => {
		const validators = overviews.reduce(
			(
				prev: Record<string, { own: bigint; total: bigint }>,
				[[, validator], { own, total }],
			) => {
				prev[validator] = { own, total }
				return prev
			},
			{},
		)

		const validatorKeys = Object.keys(validators)
		const pagedResults = await Promise.all(
			validatorKeys.map((v) =>
				serviceApi.query.erasStakersPagedEntries(Number(era), v),
			),
		)

		const result: Exposure[] = []
		let i = 0
		for (const pages of pagedResults) {
			// NOTE: Only one page is fetched for each validator for now
			const page = pages[0]

			// NOTE: Some pages turn up as undefined - might be worth exploring further
			if (!page) {
				continue
			}

			const [keyArgs, { others }] = page

			const validator = validatorKeys[i]
			const { own, total } = validators[validator]

			result.push({
				keys: [keyArgs[0].toString(), validator],
				val: {
					total: total.toString(),
					own: own.toString(),
					others: others.map(({ who, value }) => ({
						who,
						value: value.toString(),
					})),
				},
			})
			i++
		}
		return result
	}

	const handleEraTotalNominators = async () => {
		const result = await fetchEraTotalNominators(network, activeEra.index)
		setActiveNominatorsCount(result || 0)
	}

	useEffectIgnoreInitial(() => {
		if (getApiStatus(network) === 'connecting') {
			setActiveValidators(0)
			setStateWithRef(defaultEraStakers, setEraStakers, eraStakersRef)
		}
	}, [getApiStatus(network)])

	// Handle syncing with eraStakers
	useEffectIgnoreInitial(() => {
		if (isReady) {
			fetchActiveEraStakers()
			// If staking API is enabled, fetch total nominators from it
			if (pluginEnabled('staking_api') && activeEra.index > 0) {
				handleEraTotalNominators()
			}
		}
	}, [isReady, activeEra.index, pluginEnabled('staking_api'), activeAddress])

	return (
		<EraStakersContext.Provider
			value={{
				eraStakers,
				activeValidators,
				activeNominatorsCount,
				fetchEraStakers,
			}}
		>
			{children}
		</EraStakersContext.Provider>
	)
}
