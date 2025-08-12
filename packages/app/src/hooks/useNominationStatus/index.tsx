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
import type {
	BondFor,
	MaybeAddress,
	NominationStatus,
	NominationStatuses,
} from 'types'

export const useNominationStatus = () => {
	const { t } = useTranslation()
	const { isNominator } = useStaking()
	const { eraStakers } = useEraStakers()
	const { getNominations } = useBalances()
	const { getValidators } = useValidators()
	const { activePoolNominations } = useActivePool()
	const { bondedPools, poolsNominations } = useBondedPools()
	const { syncing, activePoolSynced, accountSynced } = useSyncing([
		'era-stakers',
	])

	// Gets the nomination statuses of passed in nominations
	const getNominationsStatusFromTargets = (
		who: MaybeAddress,
		fromTargets: string[],
	) => {
		const statuses: Record<string, NominationStatus> = {}

		if (!fromTargets.length) {
			return statuses
		}

		for (const target of fromTargets) {
			const staker = eraStakers.stakers.find(
				({ address }) => address === target,
			)

			if (staker === undefined) {
				statuses[target] = 'waiting'
				continue
			}

			if (!(staker.others ?? []).find((o) => o.who === who)) {
				statuses[target] = 'inactive'
				continue
			}
			statuses[target] = 'active'
		}
		return statuses
	}

	// Utility to check if the nomination status is
	//
	// NOTE: Not currently being used, requires more logic for nominator status
	const nominationStatusSyncing = (who: MaybeAddress, bondFor: BondFor) => {
		if (!accountSynced(who)) {
			return true
		}
		if (bondFor === 'pool') {
			return !activePoolSynced(who)
		} else {
			return false
		}
	}

	// Utility to get an account's nominees alongside their status.
	const getNominationSetStatus = (who: MaybeAddress, bondFor: BondFor) => {
		const nominations =
			bondFor === 'nominator'
				? getNominations(who)
				: (activePoolNominations?.targets ?? [])

		return getNominationsStatusFromTargets(who, nominations)
	}

	// Utility to get the nominees of a provided nomination status.
	const getNomineesByStatus = (
		nominees: [string, NominationStatus][],
		status: string,
	) => nominees.map(([k, v]) => (v === status ? k : false)).filter((v) => !!v)

	// Utility to get the status of the provided account's nominations, and whether they are earning
	// reards.
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
					const others =
						eraStakers.stakers.find(({ address }) => address === nominee)
							?.others || []

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

		const nominationStatus = getNominationsStatusFromTargets(nominator, [
			target,
		])
		return getPoolNominationStatusCode(nominationStatus)
	}

	// Determine bonded pool's current nomination statuse
	const getPoolNominationStatusCode = (statuses: NominationStatuses | null) => {
		let status: NominationStatus = 'waiting'

		if (statuses) {
			for (const childStatus of Object.values(statuses)) {
				if (childStatus === 'active') {
					status = 'active'
					break
				}
				if (childStatus === 'inactive') {
					status = 'inactive'
				}
			}
		}
		return status
	}

	return {
		getNominationStatus,
		getNominationSetStatus,
		nominationStatusSyncing,
		getNominationsStatusFromTargets,
		getPoolNominationStatus,
		getPoolNominationStatusCode,
	}
}
