// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useSyncing } from 'hooks/useSyncing'
import type { UsePoolBondActions } from './types'

export const usePoolBondActions = (): UsePoolBondActions => {
	const { syncing } = useSyncing([
		'initialization',
		'era-stakers',
		'active-pools',
	])
	const { activeAddress } = useActiveAccounts()
	const { isReadOnlyAccount } = useImportedAccounts()
	const { balances } = useAccountBalances(activeAddress)
	const { isBonding, isMember, isDepositor, activePool } = useActivePool()

	// Determine bond disabled status
	const bondDisabled =
		syncing ||
		!isBonding ||
		!isMember() ||
		isReadOnlyAccount(activeAddress) ||
		activePool?.bondedPool.state === 'Destroying'

	// Determine if user can leave the pool
	const canLeavePool = isMember() && !isDepositor() && balances.pool.active > 0n

	return {
		canLeavePool,
		bondDisabled,
	}
}
