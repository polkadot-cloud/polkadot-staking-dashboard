// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util/chains'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useFetchMethods } from 'hooks/useFetchMethods'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { MaybeAddress } from 'types'
import { defaultNominatorProgress } from './defaults'
import { getLocalNominatorSetups, setLocalNominatorSetups } from './local'
import type {
	NominatorProgress,
	NominatorSetup,
	NominatorSetups,
	NominatorSetupsContextInterface,
	PayeeOption,
} from './types'

export const [NominatorSetupContext, useNominatorSetups] =
	createSafeContext<NominatorSetupsContextInterface>()

export const NominatorSetupsProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const { network } = useNetwork()
	const { fetch } = useFetchMethods()
	const { activeAddress } = useActiveAccounts()
	const {
		balances: {
			nominator: { totalPossibleBond },
		},
	} = useAccountBalances(activeAddress)
	const { accounts, stringifiedAccountsKey } = useImportedAccounts()
	const { units } = getStakingChainData(network)

	// Store all imported accounts nominator setups
	const [nominatorSetups, setNominatorSetupsState] = useState<NominatorSetups>(
		{},
	)

	// Update nominator setups state
	const setNominatorSetups = useCallback((setups: NominatorSetups) => {
		setLocalNominatorSetups(setups)
		setNominatorSetupsState(setups)
	}, [])

	// Utility to update the progress item of a nominator setup
	const updateSetups = useCallback(
		(
			all: NominatorSetups,
			progress: NominatorProgress,
			account: string,
			maybeSection: number | undefined,
		) => {
			const current = Object.assign(all[account] || {})
			const section = maybeSection ?? current.section ?? 1

			all[account] = {
				...current,
				progress,
				section,
			}
			return all
		},
		[],
	)

	// Gets the setup progress for a connected account. Falls back to default setup if progress does
	// not yet exist
	const getNominatorSetup = useCallback(
		(address: MaybeAddress): NominatorSetup => {
			const setup = Object.fromEntries(
				Object.entries(nominatorSetups).filter(([k]) => k === address),
			)
			return (
				setup[address || ''] || {
					progress: defaultNominatorProgress,
					section: 1,
				}
			)
		},
		[nominatorSetups],
	)

	const setNominatorSetup = useCallback(
		(progress: NominatorProgress, section?: number) => {
			if (activeAddress) {
				const updatedSetups = updateSetups(
					{ ...nominatorSetups },
					progress,
					activeAddress,
					section,
				)
				setNominatorSetups(updatedSetups)
			}
		},
		[activeAddress, nominatorSetups, updateSetups, setNominatorSetups],
	)

	// Remove setup progress for an account
	const removeNominatorSetup = useCallback(
		(address: MaybeAddress) => {
			const updatedSetups = Object.fromEntries(
				Object.entries(nominatorSetups).filter(([k]) => k !== address),
			)
			setNominatorSetups(updatedSetups)
		},
		[nominatorSetups, setNominatorSetups],
	)

	// Sets a nominator setup section for an address
	const setNominatorSetupSection = useCallback(
		(section: number) => {
			if (activeAddress) {
				const newSetups = { ...nominatorSetups }
				const updatedSetups = updateSetups(
					newSetups,
					newSetups[activeAddress]?.progress || defaultNominatorProgress,
					activeAddress,
					section,
				)
				setNominatorSetups(updatedSetups)
			}
		},
		[activeAddress, nominatorSetups, updateSetups, setNominatorSetups],
	)

	// Gets the stake setup progress as a percentage for an address
	const getNominatorSetupPercent = useCallback(
		(address: MaybeAddress) => {
			if (!address) {
				return 0
			}
			const { progress } = getNominatorSetup(address)
			const bond = new BigNumber(progress?.bond || '0')

			const p = 33
			let percentage = 0
			if (bond.isGreaterThan(0)) {
				percentage += p
			}
			if (progress.nominations.length) {
				percentage += p
			}
			if (progress.payee.destination !== null) {
				percentage += p
			}
			return percentage
		},
		[getNominatorSetup],
	)

	// Update setup state when active address, network or imported accounts change
	useEffectIgnoreInitial(() => {
		if (accounts.length) {
			setNominatorSetups(getLocalNominatorSetups())
		}
	}, [activeAddress, network, stringifiedAccountsKey])

	const generateOptimalSetup = useCallback((): NominatorProgress => {
		const setup = {
			payee: {
				destination: 'Staked' as PayeeOption,
				account: null,
			},
			nominations: fetch('Optimal Selection'),
			bond: planckToUnit(totalPossibleBond, units),
		}
		return setup
	}, [fetch, totalPossibleBond, units])

	const contextValue = useMemo(
		() => ({
			getNominatorSetup,
			setNominatorSetup,
			removeNominatorSetup,
			getNominatorSetupPercent,
			setNominatorSetupSection,
			generateOptimalSetup,
		}),
		[
			getNominatorSetup,
			setNominatorSetup,
			removeNominatorSetup,
			getNominatorSetupPercent,
			setNominatorSetupSection,
			generateOptimalSetup,
		],
	)

	return (
		<NominatorSetupContext.Provider value={contextValue}>
			{children}
		</NominatorSetupContext.Provider>
	)
}
