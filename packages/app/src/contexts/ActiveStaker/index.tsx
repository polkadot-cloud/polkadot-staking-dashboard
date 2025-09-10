// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { fetchGetStakerWithNominees } from 'plugin-staking-api'
import type { ActiveStatusWithNominees } from 'plugin-staking-api/types'
import { type ReactNode, useEffect, useState } from 'react'
import type { ActiveStakerContextInterface } from './types'

export const [ActiveStakerContext, useActiveStaker] =
	createSafeContext<ActiveStakerContextInterface>()

export const ActiveStakerProvider = ({ children }: { children: ReactNode }) => {
	const { activeAddress } = useActiveAccounts()
	const { network } = useNetwork()
	const { pluginEnabled } = usePlugins()
	const { getNominations } = useBalances()
	const nominations = getNominations(activeAddress)

	// Active staker data from Staking API
	const [activeNominatorData, setActiveNominatorData] = useState<
		ActiveStatusWithNominees | null | undefined
	>(undefined)

	// Handle fetching of active staker with nominees
	const handleFetchStaker = async (who: string) => {
		const result = await fetchGetStakerWithNominees(network, who, nominations)
		setActiveNominatorData(result)
	}

	// Fetch active staker with nominees when nominating status or active address updates
	useEffect(() => {
		if (
			pluginEnabled('staking_api') &&
			activeAddress &&
			nominations.length > 0
		) {
			handleFetchStaker(activeAddress)
		} else {
			setActiveNominatorData(undefined)
		}
	}, [activeAddress, nominations])

	return (
		<ActiveStakerContext.Provider
			value={{
				activeNominatorData,
			}}
		>
			{children}
		</ActiveStakerContext.Provider>
	)
}
