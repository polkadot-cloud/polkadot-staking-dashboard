// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useActiveAccountPool } from 'hooks/useActiveAccountPool'
import { useSyncing } from 'hooks/useSyncing'
import { useTips } from 'hooks/useTips'
import { Stat } from 'library/Stat'
import { NominationStatus } from 'pages/Nominate/Active/Status/NominationStatus'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { Tips } from 'ui-tips'
import { StatusWrapper } from '../Wrappers'

export const Status = () => {
	const { network } = useNetwork()
	const { t } = useTranslation('pages')
	const { items } = useTips()
	const { isBonding } = useStaking()
	const { activeAddress } = useActiveAccounts()
	const { syncing } = useSyncing(['initialization'])
	const { inPool, activePool, membershipDisplay, label } =
		useActiveAccountPool()

	const notStaking = !inPool && !isBonding
	const showNominate = notStaking || isBonding
	const showMembership = notStaking || inPool

	return (
		<StatusWrapper>
			<div className="content">
				{showNominate ? (
					<Page.RowSection
						secondary={showMembership}
						standalone={!showMembership}
					>
						<section>
							<NominationStatus />
						</section>
					</Page.RowSection>
				) : (
					<Page.RowSection
						hLast={showNominate}
						vLast={showNominate}
						standalone={true}
					>
						<section>
							{activePool ? (
								<Stat
									label={label}
									helpKey="Pool Membership"
									type="address"
									stat={{
										address: activePool?.addresses?.stash ?? '',
										display: membershipDisplay,
									}}
								/>
							) : (
								<Stat
									label={t('poolMembership')}
									helpKey="Pool Membership"
									stat={isBonding ? t('alreadyNominating') : t('notInPool')}
								/>
							)}
						</section>
					</Page.RowSection>
				)}
			</div>
			<Tips
				items={items}
				syncing={syncing}
				onPageReset={{ network, activeAddress }}
			/>
		</StatusWrapper>
	)
}
