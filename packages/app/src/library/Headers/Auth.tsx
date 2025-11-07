// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonAccount } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import { AuthPopover } from './Popovers/AuthPopover'

export const Auth = () => {
	const { t } = useTranslation('app')
	const { themeElementRef } = useTheme()
	const { openModal } = useOverlay().modal

	const SIGNED_IN = false

	const [open, setOpen] = useState<boolean>(false)

	const style = {
		paddingRight: '1.5rem',
		paddingLeft: '1.25rem',
	}

	return !SIGNED_IN ? (
		<ButtonAccount.Standalone
			label={t('signIn')}
			iconLeft={faUser}
			style={style}
			hasSeparator
			onClick={() => {
				openModal({ key: 'SignIn', size: 'sm' })
			}}
		/>
	) : (
		<Popover
			open={open}
			portalContainer={themeElementRef.current || undefined}
			content={<AuthPopover setOpen={setOpen} />}
			onTriggerClick={() => {
				setOpen(!open)
			}}
		>
			<ButtonAccount.Standalone
				label={t('myAccount')}
				iconLeft={faUser}
				iconRight={faChevronDown}
				style={style}
				hasSeparator
				className="header-auth"
			/>
		</Popover>
	)
}
