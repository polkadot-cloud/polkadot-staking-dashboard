// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useQuickActions } from 'hooks/useQuickActions'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'

export const Disconnected = () => {
	const { activeAddress } = useActiveAccounts()
	const { baseQuickActions } = useQuickActions()
	const { hasEnoughToNominate } = useAccountBalances(activeAddress)

	const actions: ButtonQuickActionProps[] = [baseQuickActions.accounts]

	if (hasEnoughToNominate) {
		actions.push(baseQuickActions.nominate)
	}

	actions.push(
		baseQuickActions.joinPool,
		baseQuickActions.ledger,
		baseQuickActions.vault,
	)

	return (
		<QuickAction.Container>
			{actions.map((action, i) => (
				<QuickAction.Button key={`action-${i}`} {...action} />
			))}
		</QuickAction.Container>
	)
}
