// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useBalances } from 'contexts/Balances'
import { useEraStakers } from 'contexts/EraStakers'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import { useTranslation } from 'react-i18next'
import type { BondFor, MaybeAddress, NominationStatus } from 'types'
import { filterNomineesByStatus, getPoolNominationStatusCode } from 'utils'

export const useNominationStatus = () => {
	const { t } = useTranslation()
	const { pluginEnabled } = usePlugins()
	const { getNominations } = useBalances()
	const { syncing } = useSyncing(['era-stakers'])
	const { activePoolNominations } = useActivePool()
	const { isNominator, activeStakerData } = useStaking()
	const { bondedPools, poolsNominations } = useBondedPools()
	const { getNominationsStatusFromEraStakers } = useEraStakers()

	// Utility to get an account's nominees alongside their status.
	const getNominationSetStatus = (
		who: MaybeAddress,
		bondFor: BondFor,
	): Record<string, NominationStatus> => {
		const nominations =
			bondFor === 'nominator'
				? getNominations(who)
				: (activePoolNominations?.targets ?? [])

		if (pluginEnabled('staking_api')) {
			// convert statuses into record of string -> status
			const statuses = activeStakerData?.statuses.reduce(
				(acc: Record<string, NominationStatus>, { address, status }) => {
					acc[address] = status as NominationStatus
					return acc
				},
				{},
			)
			return statuses || {}
		} else {
			return getNominationsStatusFromEraStakers(who, nominations)
		}
	}

	// Gets the status of the provided account's nominations, and whether they are earning reards
	const getNominationStatus = (who: MaybeAddress, type: BondFor) => {
		// Get the sets nominees from the provided account's targets
		const nominees = Object.entries(getNominationSetStatus(who, type))
		const activeNominees = filterNomineesByStatus(nominees, 'active')
		const earningRewards = activeNominees.length > 0

		// Determine the localised message to display based on the nomination status.
		let message
		if (!isNominator || syncing) {
			message = t('notNominating', { ns: 'pages' })
		} else if (!nominees.length) {
			message = t('noNominationsSet', { ns: 'pages' })
		} else if (activeNominees.length) {
			message = t('nominatingAnd', { ns: 'pages' })
			if (earningRewards) {
				message += ` ${t('earningRewards', { ns: 'pages' })}`
			} else {
				message += ` ${t('notEarningRewards', { ns: 'pages' })}`
			}
		} else {
			message = t('waitingForActiveNominations', { ns: 'pages' })
		}

		return {
			nominees: {
				active: activeNominees,
				inactive: filterNomineesByStatus(nominees, 'inactive'),
				waiting: filterNomineesByStatus(nominees, 'waiting'),
			},
			earningRewards,
			message,
		}
	}

	// Get bonded pool nomination statuses
	const getPoolNominationStatus = (
		nominator: MaybeAddress,
		nomination: MaybeAddress,
	): NominationStatus => {
		const pool = bondedPools.find((p) => p.addresses.stash === nominator)
		if (!pool) {
			return 'waiting'
		}
		// get pool targets from nominations metadata
		const nominations = poolsNominations[pool.id]
		const targets = nominations ? nominations.targets : []
		const target = targets.find((item) => item === nomination)
		if (!target) {
			return 'waiting'
		}
		const nominationStatus = getNominationsStatusFromEraStakers(nominator, [
			target,
		])
		return getPoolNominationStatusCode(nominationStatus)
	}

	return {
		getNominationStatus,
		getNominationSetStatus,
		getPoolNominationStatus,
	}
}
