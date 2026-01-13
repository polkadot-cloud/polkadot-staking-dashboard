// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useQuickActions } from 'hooks/useQuickActions'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'

export const Disconnected = () => {
	const { baseQuickActions } = useQuickActions()

	const actions: ButtonQuickActionProps[] = [
		baseQuickActions.accounts,
		baseQuickActions.nominate,
		baseQuickActions.joinPool,
		baseQuickActions.email,
		baseQuickActions.discord,
	]

	return (
		<QuickAction.Container>
			{actions.map((action, i) => (
				<QuickAction.Button key={`action-${i}`} {...action} />
			))}
		</QuickAction.Container>
	)
}
