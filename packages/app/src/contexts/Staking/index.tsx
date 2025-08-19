// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import type { StakingContextInterface } from 'contexts/Staking/types'
import { fetchGetStakerWithNominees } from 'plugin-staking-api'
import type { ActiveStatusWithNominees } from 'plugin-staking-api/types'
import { type ReactNode, useEffect, useState } from 'react'

export const [StakingContext, useStaking] =
	createSafeContext<StakingContextInterface>()

export const StakingProvider = ({ children }: { children: ReactNode }) => {
	const { network } = useNetwork()
	const { pluginEnabled } = usePlugins()
	const { activeAddress } = useActiveAccounts()
	const { getStakingLedger, getNominations } = useBalances()
	const nominations = getNominations(activeAddress)

	// Active staker data from Staking API
	const [activeStakerData, setActiveStakerData] =
		useState<ActiveStatusWithNominees | null>(null)

	// Helper function to determine whether the active account is bonding, or is yet to start
	const isBonding = (getStakingLedger(activeAddress).ledger?.active || 0n) > 0n

	// Helper function to determine whether the active account is nominating, or is yet to start
	const isNominating = nominations.length > 0

	// Helper function to determine whether the active account is a nominator
	const isNominator = activeAddress !== null && isBonding && isNominating

	// Handle fetching of active staker with nominees
	const handleFetchStaker = async (who: string) => {
		const result = await fetchGetStakerWithNominees(network, who, nominations)
		setActiveStakerData(result)
	}

	// Fetch active staker with nominees when nominating status or active address updates
	useEffect(() => {
		if (pluginEnabled('staking_api') && activeAddress && isNominating) {
			handleFetchStaker(activeAddress)
		} else {
			setActiveStakerData(null)
		}
	}, [isNominating, activeAddress, nominations])

	return (
		<StakingContext.Provider
			value={{
				isBonding,
				isNominating,
				isNominator,
				activeStakerData,
			}}
		>
			{children}
		</StakingContext.Provider>
	)
}
