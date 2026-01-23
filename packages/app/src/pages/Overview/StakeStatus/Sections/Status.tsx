// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { NominationStatus } from 'pages/Nominate/Active/Status/NominationStatus'
import { MembershipStatus } from 'pages/Pools/Status/MembershipStatus'
import { Page } from 'ui-core/base'
import { StatusWrapper } from '../Wrappers'

export const Status = () => {
	const { inPool } = useActivePool()
	const { isBonding } = useStaking()

	const notStaking = !inPool && !isBonding
	const showNominate = notStaking || isBonding
	const showMembership = notStaking || inPool

	return (
		<StatusWrapper>
			{showNominate && (
				<Page.RowSection
					secondary={showMembership}
					standalone={!showMembership}
				>
					<section>
						<NominationStatus />
					</section>
				</Page.RowSection>
			)}
			{showMembership && (
				<Page.RowSection
					hLast={showNominate}
					vLast={showNominate}
					standalone={true}
				>
					<section>
						<MembershipStatus showButtons={false} />
					</section>
				</Page.RowSection>
			)}
		</StatusWrapper>
	)
}
