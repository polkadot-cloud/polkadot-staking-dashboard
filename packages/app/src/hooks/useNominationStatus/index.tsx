// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useBalances } from 'contexts/Balances'
import { useEraStakers } from 'contexts/EraStakers'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useStaking } from 'contexts/Staking'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { useTranslation } from 'react-i18next'
import type { BondFor, MaybeAddress, NominationStatus } from 'types'
import { getNomineesByStatus, getPoolNominationStatusCode } from 'utils'

export const useNominationStatus = () => {
	const { t } = useTranslation()
	const { isNominator } = useStaking()
	const { getNominations } = useBalances()
	const { getValidators } = useValidators()
	const { syncing } = useSyncing(['era-stakers'])
	const { activePoolNominations } = useActivePool()
	const { bondedPools, poolsNominations } = useBondedPools()
	const { getActiveValidator, getNominationsStatusFromEraStakers } =
		useEraStakers()

	// Utility to get an account's nominees alongside their status.
	const getNominationSetStatus = (who: MaybeAddress, bondFor: BondFor) => {
		const nominations =
			bondFor === 'nominator'
				? getNominations(who)
				: (activePoolNominations?.targets ?? [])

		return getNominationsStatusFromEraStakers(who, nominations)
	}

	// Gets the status of the provided account's nominations, and whether they are earning reards
	const getNominationStatus = (who: MaybeAddress, type: BondFor) => {
		// Get the sets nominees from the provided account's targets.
		const nominees = Object.entries(getNominationSetStatus(who, type))
		const activeNominees = getNomineesByStatus(nominees, 'active')

		// Determine whether active nominees are earning rewards. This function exists once the
		// eras stakers has synced.
		let earningRewards = false
		if (!syncing) {
			getNomineesByStatus(nominees, 'active').every((nominee) => {
				const validator = getValidators().find(
					({ address }) => address === nominee,
				)
				if (validator) {
					const others = (nominee && getActiveValidator(nominee)?.others) || []

					if (others.length) {
						// If the provided account is a part of the validator's backers they are earning
						// rewards.
						earningRewards = true
						return false
					}
				}
				return true
			})
		}

		// Determine the localised message to display based on the nomination status.
		let str
		if (!isNominator || syncing) {
			str = t('notNominating', { ns: 'pages' })
		} else if (!nominees.length) {
			str = t('noNominationsSet', { ns: 'pages' })
		} else if (activeNominees.length) {
			str = t('nominatingAnd', { ns: 'pages' })
			if (earningRewards) {
				str += ` ${t('earningRewards', { ns: 'pages' })}`
			} else {
				str += ` ${t('notEarningRewards', { ns: 'pages' })}`
			}
		} else {
			str = t('waitingForActiveNominations', { ns: 'pages' })
		}

		return {
			nominees: {
				active: activeNominees,
				inactive: getNomineesByStatus(nominees, 'inactive'),
				waiting: getNomineesByStatus(nominees, 'waiting'),
			},
			earningRewards,
			message: str,
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
