// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
// SPDX-License-Identifier: GPL-3.0-only

import {
	faAdd,
	faArrowDown,
	faCircleDown,
	faCircleXmark,
	faCoins,
	faMinus,
	faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { usePayouts } from 'contexts/Payouts'
import { useTranslation } from 'react-i18next'
import type { BondFor } from 'types'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'
import { useOverlay } from 'ui-overlay'

export const Staking = ({ bondFor }: { bondFor: BondFor }) => {
	const { t } = useTranslation('pages')
	const { openModal } = useOverlay().modal
	const { unclaimedRewards } = usePayouts()
	const { activeAddress } = useActiveAccounts()
	const { getPendingPoolRewards } = useBalances()

	const pendingRewards = getPendingPoolRewards(activeAddress)

	const actions: ButtonQuickActionProps[] = []

	actions.push({
		onClick: () => {
			openModal({
				key: 'Transfer',
				options: {},
				size: 'sm',
			})
		},
		disabled: false,
		Icon: () => <FontAwesomeIcon transform="grow-1" icon={faPaperPlane} />,
		label: t('send'),
	})

	if (bondFor === 'pool') {
		actions.push(
			...[
				{
					onClick: () => {
						openModal({
							key: 'ClaimReward',
							options: { claimType: 'withdraw' },
							size: 'sm',
						})
					},
					disabled: pendingRewards === 0n,
					Icon: () => (
						<FontAwesomeIcon transform="grow-2" icon={faCircleDown} />
					),
					label: t('withdraw'),
				},
				{
					onClick: () => {
						openModal({
							key: 'ClaimReward',
							options: { claimType: 'bond' },
							size: 'sm',
						})
					},
					disabled: pendingRewards === 0n,
					Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCoins} />,
					label: t('compound'),
				},
			],
		)
	} else {
		actions.push({
			onClick: () => {
				openModal({
					key: 'ClaimPayouts',
					size: 'sm',
				})
			},
			disabled: BigInt(unclaimedRewards.total) === 0n,
			Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCircleDown} />,
			label: t('claim', { ns: 'modals' }),
		})
	}

	actions.push(
		...[
			{
				onClick: () => {
					openModal({
						key: 'Bond',
						options: { bondFor },
						size: 'sm',
					})
				},
				disabled: false,
				Icon: () => <FontAwesomeIcon transform="grow-2" icon={faAdd} />,
				label: t('bond', { ns: 'pages' }),
			},
			{
				onClick: () => {
					openModal({
						key: 'Unbond',
						options: { bondFor },
						size: 'sm',
					})
				},
				disabled: false,
				Icon: () => <FontAwesomeIcon transform="grow-2" icon={faMinus} />,
				label: t('unbond', { ns: 'pages' }),
			},
		],
	)

	if (bondFor === 'nominator') {
		actions.push(
			...[
				{
					onClick: () => {
						openModal({ key: 'UpdatePayee', size: 'sm' })
					},
					disabled: false,
					Icon: () => <FontAwesomeIcon transform="grow-2" icon={faArrowDown} />,
					label: t('payee.label', { ns: 'app' }),
				},
				{
					onClick: () => {
						openModal({
							key: 'Unstake',
							size: 'sm',
						})
					},
					disabled: false,
					Icon: () => (
						<FontAwesomeIcon transform="grow-2" icon={faCircleXmark} />
					),
					label: t('stop', { ns: 'pages' }),
				},
			],
		)
	} else {
		actions.push({
			onClick: () => {
				openModal({
					key: 'LeavePool',
					size: 'sm',
				})
			},
			disabled: false,
			Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCircleXmark} />,
			label: t('stop', { ns: 'pages' }),
		})
	}

	return (
		<QuickAction.Container>
			{actions.map((action, i) => (
				<QuickAction.Button key={`action-${i}`} {...action} />
			))}
		</QuickAction.Container>
	)
}
