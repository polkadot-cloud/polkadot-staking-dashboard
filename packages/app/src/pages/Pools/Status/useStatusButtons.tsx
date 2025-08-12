// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useTranslation } from 'react-i18next'

export const useStatusButtons = () => {
	const { t } = useTranslation('pages')
	const {
		isReady,
		poolsConfig: { maxPools },
	} = useApi()
	const { isOwner } = useActivePool()
	const { bondedPools } = useBondedPools()
	const { getPoolMembership } = useBalances()
	const { activeAddress } = useActiveAccounts()
	const { isReadOnlyAccount } = useImportedAccounts()

	const { balances } = useAccountBalances(activeAddress)
	const { membership } = getPoolMembership(activeAddress)
	const { active } = balances.pool

	const getCreateDisabled = () => {
		if (!isReady || isReadOnlyAccount(activeAddress) || !activeAddress) {
			return true
		}
		if ((maxPools && maxPools === 0) || bondedPools.length === maxPools) {
			return true
		}
		return false
	}

	let label

	const getJoinDisabled = () =>
		!isReady ||
		isReadOnlyAccount(activeAddress) ||
		!activeAddress ||
		!bondedPools.length

	if (!membership) {
		label = t('membership')
	} else if (isOwner()) {
		label = `${t('ownerOfPool')} ${membership.poolId}`
	} else if (active > 0n) {
		label = `${t('memberOfPool')} ${membership.poolId}`
	} else {
		label = `${t('leavingPool')} ${membership.poolId}`
	}
	return { label, getJoinDisabled, getCreateDisabled }
}
