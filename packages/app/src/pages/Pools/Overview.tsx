// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool'
import { CardWrapper } from 'library/Card/Wrappers'
import { WithdrawPrompt } from 'library/WithdrawPrompt'
import { Page } from 'ui-core/base'
import { ClosurePrompts } from './ClosurePrompts'
import { ManageBond } from './ManageBond'
import { ManagePool } from './ManagePool'
import { PoolStats } from './PoolStats'
import { Roles } from './Roles'
import { Status } from './Status'

export const PoolOverview = () => {
	const { getPoolRoles, activePool } = useActivePool()
	const ROW_HEIGHT = 220

	return (
		<>
			<ClosurePrompts />
			<WithdrawPrompt bondFor="pool" />
			<Page.Row>
				<Page.RowSection secondary vLast>
					<CardWrapper height={ROW_HEIGHT}>
						<ManageBond />
					</CardWrapper>
				</Page.RowSection>
				<Page.RowSection hLast>
					<Status height={ROW_HEIGHT} />
				</Page.RowSection>
			</Page.Row>
			{activePool !== undefined && (
				<>
					<ManagePool />
					<Page.Row>
						<CardWrapper>
							<Roles defaultRoles={getPoolRoles()} />
						</CardWrapper>
					</Page.Row>
					<Page.Row>
						<PoolStats />
					</Page.Row>
				</>
			)}
		</>
	)
}
