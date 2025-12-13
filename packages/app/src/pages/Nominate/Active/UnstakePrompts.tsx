// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useThemeValues } from 'contexts/ThemeValues'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { ButtonRow, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const UnstakePrompts = () => {
	const { t } = useTranslation('pages')
	const { syncing } = useSyncing()
	const { network } = useNetwork()
	const { openModal } = useOverlay().modal
	const { getThemeValue } = useThemeValues()
	const { activeAddress } = useActiveAccounts()
	const { balances } = useAccountBalances(activeAddress)
	const { active, totalUnlockChunks, totalUnlocked, totalUnlocking } =
		balances.nominator

	const { unit } = getStakingChainData(network)

	// Is unlocking
	const isUnlocking = totalUnlockChunks > 0

	// unstaking can withdraw
	const canWithdrawUnlocks =
		active === 0n && totalUnlocking === 0n && totalUnlocked > 0n

	return (
		isUnlocking &&
		!syncing && (
			<Page.Row>
				<CardWrapper
					style={{
						border: `1px solid ${getThemeValue('--accent-color-secondary')}`,
					}}
				>
					<div className="content">
						<h3>{t('unstakePromptInProgress')}</h3>
						<h4>
							{!canWithdrawUnlocks
								? t('unstakePromptWaitingForUnlocks')
								: `${t('unstakePromptReadyToWithdraw')} ${t(
										'unstakePromptRevert',
										{ unit },
									)}`}
						</h4>
						<ButtonRow yMargin>
							<ButtonPrimary
								iconLeft={faLockOpen}
								text={
									canWithdrawUnlocks
										? t('unlocked')
										: String(totalUnlockChunks ?? 0)
								}
								disabled={false}
								onClick={() =>
									openModal({
										key: 'UnlockChunks',
										options: {
											bondFor: 'nominator',
											poolClosure: true,
											disableWindowResize: true,
											disableScroll: true,
										},
										size: 'sm',
									})
								}
							/>
						</ButtonRow>
					</div>
				</CardWrapper>
			</Page.Row>
		)
	)
}
