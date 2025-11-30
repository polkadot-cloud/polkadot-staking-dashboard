// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import { CallToActionWrapper } from 'library/CallToAction'
import { CardWrapper } from 'library/Card/Wrappers'
import { CallToActionLoader } from 'library/Loader/CallToAction'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { AverageRewardRate } from './Stats/AverageRewardRate'
import { MinJoinBond } from './Stats/MinJoinBond'
import { NextRewards } from './Stats/NextRewards'

export const Stake = () => {
	const { t } = useTranslation('pages')
	const { activeAddress } = useActiveAccounts()
	const { inPool } = useActivePool()
	const { isBonding } = useStaking()
	const { getPoolStatusSynced } = useSyncing()
	const { isReadOnlyAccount } = useImportedAccounts()
	const { openModal } = useOverlay().modal

	const syncing = !getPoolStatusSynced()
	const isNotStaking = !inPool && !isBonding

	// Handle join pool button press - opens JoinPool modal
	const handleOnJoinPool = () => {
		openModal({ key: 'JoinPool', size: 'xs' })
	}

	// Disable join button if data is not ready or user is already staking
	const joinButtonDisabled =
		syncing || isBonding || isReadOnlyAccount(activeAddress)

	return (
		<>
			<Page.Title title={t('stake')} />
			<Stat.Row>
				<AverageRewardRate />
				<MinJoinBond />
				<NextRewards />
			</Stat.Row>
			<Page.Row>
				<CardWrapper
					className={isNotStaking && !syncing ? 'prompt' : undefined}
				>
					<CallToActionWrapper>
						{syncing ? (
							<CallToActionLoader />
						) : (
							<section>
								<div className="buttons">
									<div
										className={`button primary standalone${joinButtonDisabled ? ` disabled` : ``}${!joinButtonDisabled ? ` pulse` : ``}`}
									>
										<button
											type="button"
											onClick={handleOnJoinPool}
											disabled={joinButtonDisabled}
										>
											{t('joinPool')}
											<FontAwesomeIcon icon={faUserPlus} />
										</button>
									</div>
								</div>
							</section>
						)}
					</CallToActionWrapper>
				</CardWrapper>
			</Page.Row>
		</>
	)
}
