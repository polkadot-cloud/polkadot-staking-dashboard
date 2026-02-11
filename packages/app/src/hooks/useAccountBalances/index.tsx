// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { NominateBuffer } from 'consts/nominate'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import type { AccountBalances } from 'types'
import { calculateAllBalances } from 'utils'

export const useAccountBalances = (address: MaybeString) => {
	const {
		getPoolMembership,
		getStakingLedger,
		getAccountBalance,
		getEdReserved,
	} = useBalances()
	const { network } = useNetwork()
	const { feeReserve } = useBalances()
	const { activeEra, stakingMetrics } = useApi()
	const { units } = getStakingChainData(network)

	// Calculates various balances for an account pertaining to free balance, nominating and pools.
	// Gets balance numbers from `useBalances` state, which only takes the active accounts from
	// `Balances`
	const getBalances = (): AccountBalances => {
		const accountBalance = getAccountBalance(address)
		const stakingLedger = getStakingLedger(address)
		const { membership } = getPoolMembership(address)
		const edReserved = getEdReserved()
		const balances = calculateAllBalances(
			accountBalance,
			stakingLedger,
			membership,
			edReserved,
			feeReserve,
			activeEra.index,
		)
		return balances
	}

	// Gets staked balance, whether nominating or in pool, for an account
	const getStakedBalance = (): BigNumber => {
		const allTransferOptions = getBalances()

		// Total funds nominating
		const nominating = planckToUnit(
			allTransferOptions.nominator.active +
				allTransferOptions.nominator.totalUnlocking +
				allTransferOptions.nominator.totalUnlocked,
			units,
		)

		// Total funds in pool
		const inPool = planckToUnit(
			allTransferOptions.pool.active +
				allTransferOptions.pool.totalUnlocking +
				allTransferOptions.pool.totalUnlocked,
			units,
		)

		// Determine the actual staked balance
		const nominatingBn = new BigNumber(nominating)
		const inPoolBn = new BigNumber(inPool)
		return !nominatingBn.isZero()
			? nominatingBn
			: !inPoolBn.isZero()
				? inPoolBn
				: new BigNumber(0)
	}

	// Check if user has enough balance to nominate (including locked balance that can be used for
	// staking). Implements a buffer to ensure bond is always above minimum to earn rewards in
	// volatile conditions.
	const hasEnoughToNominate = (): boolean => {
		const allBalances = getBalances()
		const { minNominatorBond } = stakingMetrics
		const minNominatorBondBuffer = (minNominatorBond * NominateBuffer) / 100n

		return (
			allBalances.freeBalance - feeReserve + allBalances.lockedBalance >
			minNominatorBondBuffer
		)
	}

	// Check if the user has a nominating balance
	const getNominatorBalance = () => {
		const allTransferOptions = getBalances()

		// Total funds nominating
		const nominating = planckToUnit(
			allTransferOptions.nominator.active +
				allTransferOptions.nominator.totalUnlocking +
				allTransferOptions.nominator.totalUnlocked,
			units,
		)
		return new BigNumber(nominating)
	}

	return {
		balances: getBalances(),
		stakedBalance: getStakedBalance(),
		nominatorBalance: getNominatorBalance(),
		hasEnoughToNominate: hasEnoughToNominate(),
	}
}
