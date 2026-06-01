// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Heading, List, Padding } from 'ui-core/popover'

export const NotificationsPopover = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { t } = useTranslation('app')
	const popoverRef = useRef<HTMLDivElement>(null)

	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['header-notifications'])

	return (
		<div
			ref={popoverRef}
			style={{
				background: 'var(--btn-popover-tab-bg)',
				borderRadius: '0.75rem',
			}}
		>
			<Padding>
				<Heading border>{t('notification', { count: 0 })}</Heading>
				<List>{null}</List>
			</Padding>
		</div>
	)
}
