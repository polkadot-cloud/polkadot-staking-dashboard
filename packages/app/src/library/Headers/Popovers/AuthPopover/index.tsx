// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOutsideAlerter } from '@w3ux/hooks'
import { ellipsisFn } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { MenuItemButton } from 'ui-core/popover'
import { Account } from './Account'
import classes from './index.module.scss'

export const AuthPopover = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { t } = useTranslation()
	const { getAccount } = useImportedAccounts()
	const { activeAccount, activeAddress, activeProxy, activeProxyType } =
		useActiveAccounts()

	const popoverRef = useRef<HTMLDivElement>(null)

	// Close the menu if clicked outside of its container
	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['header-auth'])

	const account = getAccount(activeAccount)
	const name = account?.name || ''

	const accountLabel =
		activeAddress && activeAddress !== ''
			? name || ellipsisFn(activeAddress)
			: ''

	return (
		<div ref={popoverRef} className={classes.popover}>
			<Account address={activeAddress || ''} label={accountLabel} />
			{activeProxy && activeProxyType && (
				<Account
					address={activeProxy.address}
					label={`Signer (${activeProxyType} Proxy):`}
				/>
			)}

			<MenuItemButton
				style={{ border: 'none' }}
				onClick={() => {
					setOpen(false)
				}}
			>
				<div>
					<FontAwesomeIcon icon={faCog} transform="shrink-2" />
				</div>
				<div>
					<h3>Account Settings</h3>
					<div>
						<FontAwesomeIcon icon={faChevronRight} transform="shrink-3" />
					</div>
				</div>
			</MenuItemButton>

			<PopoverTab.Container position="bottom">
				<PopoverTab.Button
					text={t('signOut', { ns: 'app' })}
					onClick={() => {
						// TODO: Implement sign out logic
						setOpen(false)
					}}
				/>
			</PopoverTab.Container>
		</div>
	)
}
