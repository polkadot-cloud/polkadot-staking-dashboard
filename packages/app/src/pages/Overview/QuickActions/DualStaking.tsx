// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faAdd,
	faCircleXmark,
	faMinus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useQuickActions } from 'hooks/useQuickActions'
import { useTranslation } from 'react-i18next'
import { QuickAction } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'

export const DualStaking = () => {
	const { t } = useTranslation()
	const { isDepositor } = useActivePool()
	const { openModal } = useOverlay().modal
	const { baseQuickActions } = useQuickActions()

	const openPicker = (options: Record<string, unknown>) => {
		openModal({
			key: 'DualStakeAction',
			size: 'xs',
			options,
		})
	}

	return (
		<QuickAction.Container>
			<QuickAction.Button {...baseQuickActions.send} />
			<QuickAction.Button {...baseQuickActions.claimNominatorPayouts} />
			<QuickAction.Button {...baseQuickActions.withdrawPoolRewards} />
			<QuickAction.Button {...baseQuickActions.compoundPoolRewards} />
			<QuickAction.Button
				onClick={() =>
					openPicker({
						title: t('bond', { ns: 'pages' }),
						modalKey: 'Bond',
					})
				}
				disabled={false}
				Icon={() => <FontAwesomeIcon transform="grow-2" icon={faAdd} />}
				label={t('bond', { ns: 'pages' })}
			/>
			<QuickAction.Button
				onClick={() =>
					openPicker({
						title: t('unbond', { ns: 'pages' }),
						modalKey: 'Unbond',
					})
				}
				disabled={false}
				Icon={() => <FontAwesomeIcon transform="grow-2" icon={faMinus} />}
				label={t('unbond', { ns: 'pages' })}
			/>
			<QuickAction.Button {...baseQuickActions.updatePayee} />
			<QuickAction.Button
				onClick={() => {
					if (isDepositor()) {
						// Depositors can only stop nominating, not leave pool
						openModal({ key: 'Unstake', size: 'sm' })
					} else {
						openPicker({
							title: t('stop', { ns: 'pages' }),
							onSelect: (bondFor: string) => {
								if (bondFor === 'pool') {
									openModal({ key: 'LeavePool', size: 'sm' })
								} else {
									openModal({ key: 'Unstake', size: 'sm' })
								}
							},
						})
					}
				}}
				disabled={false}
				Icon={() => (
					<FontAwesomeIcon transform="grow-2" icon={faCircleXmark} />
				)}
				label={t('stop', { ns: 'pages' })}
			/>
		</QuickAction.Container>
	)
}
