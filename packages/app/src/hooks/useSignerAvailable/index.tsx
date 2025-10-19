// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import type { MaybeAddress } from 'types'

export const useSignerAvailable = () => {
	const { activeAccount, activeProxy } = useActiveAccounts()
	const { getStakingLedger } = useBalances()
	const { accountHasSigner } = useImportedAccounts()

	const signerAvailable = (who: MaybeAddress, proxySupported: boolean) => {
		const { controllerUnmigrated } = getStakingLedger(who)

		// Determine activeAccount based on whether who matches activeAccount or activeProxy
		let whoActiveAccount = activeAccount
		if (activeProxy && who === activeProxy.address) {
			whoActiveAccount = {
				address: activeProxy.address,
				source: activeProxy.source,
			}
		}

		if (controllerUnmigrated) {
			return 'controller_not_migrated'
		} else if (
			(!proxySupported || !accountHasSigner(activeProxy)) &&
			!accountHasSigner(whoActiveAccount)
		) {
			return 'read_only'
		}
		return 'ok'
	}

	return {
		signerAvailable,
	}
}
