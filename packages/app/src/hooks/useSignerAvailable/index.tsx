// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import type { ActiveAccount } from 'types'

export const useSignerAvailable = () => {
	const { getStakingLedger } = useBalances()
	const { accountHasSigner } = useImportedAccounts()
	const { activeProxy } = useActiveAccounts()

	const signerAvailable = (who: ActiveAccount, proxySupported: boolean) => {
		const { controllerUnmigrated } = getStakingLedger(who?.address || null)

		if (controllerUnmigrated) {
			return 'controller_not_migrated'
		}
		if (
			(!proxySupported || !accountHasSigner(activeProxy)) &&
			!accountHasSigner(who)
		) {
			return 'read_only'
		}
		return 'ok'
	}

	return {
		signerAvailable,
	}
}
