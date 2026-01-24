// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { determinePoolDisplay } from 'contexts/Pools/util'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useTranslation } from 'react-i18next'

export const useActiveAccountPool = () => {
	const { t } = useTranslation('pages')
	const { poolsMetaData } = useBondedPools()
	const { activeAddress } = useActiveAccounts()
	const { isReadOnlyAccount } = useImportedAccounts()
	const { balances } = useAccountBalances(activeAddress)
	const { activePool, isOwner, isBouncer, isMember } = useActivePool()

	const { active } = balances.pool
	const poolState = activePool?.bondedPool?.state ?? null

	const inPool = !!activePool
	const isActive = inPool && isMember() && active > 0n

	// Display manage button if active account is not a read-only account and active account is
	// pool owner or bouncer, or if active account is a pool member
	const canManage =
		isReadOnlyAccount(activeAddress) &&
		(isActive || (poolState !== 'Destroying' && (isOwner() || isBouncer())))

	let membershipDisplay = t('notInPool')

	if (activePool) {
		// Determine pool membership display.
		membershipDisplay = determinePoolDisplay(
			activePool.addresses.stash,
			poolsMetaData[Number(activePool.id)],
		)
	}

	return {
		inPool,
		isActive,
		canManage,
		activePool,
		membershipDisplay,
	}
}
