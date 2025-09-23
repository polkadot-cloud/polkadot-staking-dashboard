// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { fetchGetStakerWithNominees } from 'plugin-staking-api'
import type { ActiveStatusWithNominees } from 'plugin-staking-api/types'
import { type ReactNode, useEffect, useState } from 'react'
import type { ActiveStakerContextInterface } from './types'

export const [ActiveStakerContext, useActiveStaker] =
	createSafeContext<ActiveStakerContextInterface>()

export const ActiveStakerProvider = ({ children }: { children: ReactNode }) => {
	const { network } = useNetwork()
	const { pluginEnabled } = usePlugins()
	const { getNominations } = useBalances()
	const { activeAddress } = useActiveAccounts()
	const { activePool, activePoolNominations } = useActivePool()

	const nominations = getNominations(activeAddress)
	const poolNominations = activePoolNominations?.targets || []

	// Active nominator data from Staking API
	const [activeNominatorData, setActiveNominatorData] = useState<
		ActiveStatusWithNominees | null | undefined
	>(undefined)

	// Active pool data from Staking API
	const [activePoolData, setActivePoolData] = useState<
		ActiveStatusWithNominees | null | undefined
	>(undefined)

	// Handle fetching of active nominator status
	const handleFetchNominationStatus = async (who: string) => {
		const result = await fetchGetStakerWithNominees(network, who, nominations)
		setActiveNominatorData(result)
	}

	// Handle fetching of pool nominator status
	const handleFetchPoolStatus = async (who: string) => {
		const result = await fetchGetStakerWithNominees(
			network,
			who,
			poolNominations,
		)
		setActivePoolData(result)
	}

	// Fetch active nominator status when nominating status or active address updates
	useEffect(() => {
		if (
			pluginEnabled('staking_api') &&
			activeAddress &&
			nominations.length > 0
		) {
			handleFetchNominationStatus(activeAddress)
		} else {
			setActiveNominatorData(undefined)
		}
	}, [activeAddress, nominations])

	// Fetch active pool nominating status when pool nominations update
	useEffect(() => {
		if (
			pluginEnabled('staking_api') &&
			activeAddress &&
			poolNominations.length > 0 &&
			activePool?.addresses.stash
		) {
			handleFetchPoolStatus(activePool.addresses.stash)
		} else {
			setActivePoolData(undefined)
		}
	}, [poolNominations])

	return (
		<ActiveStakerContext.Provider
			value={{
				activePoolData,
				activeNominatorData,
			}}
		>
			{children}
		</ActiveStakerContext.Provider>
	)
}
