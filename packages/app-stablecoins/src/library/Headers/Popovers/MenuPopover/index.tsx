// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOutsideAlerter } from '@w3ux/hooks'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItemButton } from 'ui-core/popover'

export const MenuPopover = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { t } = useTranslation()
	const popoverRef = useRef<HTMLDivElement>(null)

	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['header-settings'])

	return (
		<div ref={popoverRef}>
			<MenuItemButton onClick={() => {}} disabled>
				<div>
					<FontAwesomeIcon icon={faWifi} transform="shrink-2" />
				</div>
				<div>
					<h3>{t('network', { ns: 'app' })}</h3>
					<div>
						<h4>Polkadot</h4>
					</div>
				</div>
			</MenuItemButton>
		</div>
	)
}
