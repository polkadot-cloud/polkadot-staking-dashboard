// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool'
import type { BondFor } from 'types'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'
import { useQuickActions } from './useQuickActions'

export const Staking = ({ bondFor }: { bondFor: BondFor }) => {
	const { isDepositor } = useActivePool()
	const { baseQuickActions, getBondQuickAction, getUnbondQuickAction } =
		useQuickActions()

	const actions: ButtonQuickActionProps[] = []

	actions.push(baseQuickActions.send)

	if (bondFor === 'pool') {
		actions.push(
			baseQuickActions.withdrawPoolRewards,
			baseQuickActions.compoundPoolRewards,
		)
	} else {
		actions.push(baseQuickActions.claimNominatorPayouts)
	}

	actions.push(getBondQuickAction(bondFor), getUnbondQuickAction(bondFor))

	if (bondFor === 'nominator') {
		actions.push(
			...[baseQuickActions.updatePayee, baseQuickActions.nominatorUnstake],
		)
	} else {
		if (!isDepositor()) {
			actions.push(baseQuickActions.leavePool)
		}
	}

	return (
		<QuickAction.Container>
			{actions.map((action, i) => (
				<QuickAction.Button key={`action-${i}`} {...action} />
			))}
		</QuickAction.Container>
	)
}
