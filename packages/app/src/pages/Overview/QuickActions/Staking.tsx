// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool'
import { useQuickActions } from 'hooks/useQuickActions'
import type { BondFor } from 'types'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'

export const Staking = ({ bondFor }: { bondFor: BondFor | 'dual' }) => {
	const { isDepositor } = useActivePool()
	const { baseQuickActions, getBondQuickAction, getUnbondQuickAction } =
		useQuickActions()

	const actions: ButtonQuickActionProps[] = []

	actions.push(baseQuickActions.send)

	if (bondFor === 'pool' || bondFor === 'dual') {
		actions.push(
			baseQuickActions.withdrawPoolRewards,
			baseQuickActions.compoundPoolRewards,
		)
	}

	if (bondFor === 'nominator' || bondFor === 'dual') {
		actions.push(baseQuickActions.claimNominatorPayouts)
	}

	// Do not include bond/unbond actions for dual stakers
	if (bondFor === 'nominator' || bondFor === 'pool') {
		actions.push(getBondQuickAction(bondFor), getUnbondQuickAction(bondFor))
	}

	if (bondFor === 'nominator' || bondFor === 'dual') {
		actions.push(baseQuickActions.updatePayee)
	}

	if (bondFor === 'nominator') {
		actions.push(baseQuickActions.nominatorUnstake)
	}

	if (bondFor === 'pool') {
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
