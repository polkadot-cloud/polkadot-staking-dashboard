// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOutsideAlerter } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useInvites } from 'contexts/Invites'
import type { PoolInvite } from 'contexts/Invites/types'
import { useStaking } from 'contexts/Staking'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { Heading, List, Padding } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'

export const NotificationsPopover = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { t } = useTranslation('app')
	const { isBonding } = useStaking()
	const { openCanvas } = useOverlay().canvas
	const { getPoolMembership } = useBalances()
	const { activeAddress } = useActiveAccounts()
	const { inviteConfig, dismissInvite } = useInvites()

	const { membership } = getPoolMembership(activeAddress)
	const alreadyStaking = membership || isBonding

	// NOTE: We assume a valid pool invite is active
	const popoverRef = useRef<HTMLDivElement>(null)

	// Determine if a pool invite is active
	let poolId: number | undefined
	if (inviteConfig?.type === 'pool') {
		poolId = (inviteConfig.invite as PoolInvite).poolId
	}

	// Close the menu if clicked outside of its container
	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['header-notifications'])

	const notifications = []
	if (inviteConfig) {
		const actions = []
		if (alreadyStaking) {
			actions.push({
				text: t('alreadyStaking', { ns: 'app' }),
				onClick: () => {
					// Do nothing
				},
				disabled: true,
			})
		} else {
			actions.push({
				text: t('viewInvite'),
				onClick: () => {
					setOpen(false)
					openCanvas({
						key: 'Pool',
						options: {
							providedPool: {
								id: poolId,
							},
						},
						size: 'xl',
					})
				},
				disabled: false,
			})
		}

		notifications.push({
			title: `${t('invitePool')}!`,
			actions: [
				...actions,
				{
					text: t('dismiss'),
					onClick: () => {
						dismissInvite()
						setOpen(false)
					},
					disabled: false,
				},
			],
		})
	}

	return (
		<div
			ref={popoverRef}
			style={{
				background: 'var(--button-popover-tab-background)',
				borderRadius: '0.75rem',
			}}
		>
			<Padding>
				<Heading
					style={{
						borderBottom:
							notifications.length > 0
								? 'none'
								: '1px solid var(--border-primary-color)',
					}}
				>
					{t('notification', { count: notifications.length })}
				</Heading>
				<List>
					{notifications.map((n, index) => (
						<div key={`notification_${index}`}>
							<h3>
								<FontAwesomeIcon icon={faPaperPlane} />
								{n.title}
							</h3>
							<PopoverTab.Container position="bottom">
								{n.actions.map((action) => (
									<PopoverTab.Button
										key={`${n.title}_${action.text}`}
										text={action.text}
										onClick={() => action.onClick()}
										disabled={action.disabled}
									/>
								))}
							</PopoverTab.Container>
						</div>
					))}
				</List>
			</Padding>
		</div>
	)
}
