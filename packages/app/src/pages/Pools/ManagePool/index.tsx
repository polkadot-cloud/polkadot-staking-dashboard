// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { Nominations } from 'library/Nominations'
import { NominationsEmpty } from 'library/NominationsEmpty'
import { Page } from 'ui-core/base'

export const ManagePool = () => {
	const { formatWithPrefs } = useValidators()
	const { isOwner, isNominator, activePoolNominations, activePool } =
		useActivePool()

	const poolNominated = activePoolNominations
		? formatWithPrefs(activePoolNominations.targets)
		: []

	const isNominating = !!activePoolNominations?.targets?.length
	const nominator = activePool?.addresses?.stash ?? null
	const { state } = activePool?.bondedPool || {}

	const canNominate = isOwner() || isNominator()

	return (
		<Page.Row>
			<CardWrapper>
				{canNominate && !isNominating && state !== 'Destroying' ? (
					<NominationsEmpty
						bondFor="pool"
						nominator={nominator}
						nominated={poolNominated}
						disabled={!canNominate}
					/>
				) : (
					<Nominations bondFor="pool" nominator={nominator} />
				)}
			</CardWrapper>
		</Page.Row>
	)
}
