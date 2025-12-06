// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import type { UseBondActions } from './types'

export const useBondActions = (): UseBondActions => {
	const { isReady } = useApi()
	const { isBonding } = useStaking()
	const { activeAddress } = useActiveAccounts()
	const { syncing, accountSynced } = useSyncing([
		'initialization',
		'era-stakers',
	])
	const { isReadOnlyAccount } = useImportedAccounts()

	const isReadOnly = isReadOnlyAccount(activeAddress)
	const isAccountSynced = accountSynced(activeAddress)
	const isLoading = !isReady || syncing || !isAccountSynced

	// Basic requirements: account must exist, not be read-only, not be syncing, and must already be
	// actively bonding (e.g. nominator setup complete).
	const basicRequirements =
		activeAddress && !isReadOnly && !isLoading && isBonding

	// Bond actions require basic requirements and bonding capability
	const canBond = Boolean(basicRequirements)

	// Unbond actions require basic requirements and active bonding
	const canUnbond = Boolean(basicRequirements)

	// Unstake actions require basic requirements and active bonding
	const canUnstake = Boolean(basicRequirements)

	return {
		canBond,
		canUnbond,
		canUnstake,
	}
}
