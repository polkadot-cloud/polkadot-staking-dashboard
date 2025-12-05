// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOutsideAlerter } from '@w3ux/hooks'
import { ellipsisFn } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { setActiveProxy } from 'global-bus'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { MenuItemButton } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import { Account } from './Account'
import classes from './index.module.scss'

export const AccountPopover = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { t } = useTranslation()
	const { network } = useNetwork()
	const { openModal } = useOverlay().modal
	const { getAccount } = useImportedAccounts()
	const {
		activeAccount,
		activeAddress,
		activeProxy,
		activeProxyType,
		setActiveAccount,
	} = useActiveAccounts()

	const popoverRef = useRef<HTMLDivElement>(null)

	// Close the menu if clicked outside of its container
	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['header-account'])

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
					openModal({ key: 'Transfer', size: 'sm' })
				}}
			>
				<div>
					<FontAwesomeIcon icon={faPaperPlane} transform="shrink-2" />
				</div>
				<div>
					<h3>Transfer</h3>
					<div>
						<FontAwesomeIcon icon={faChevronRight} transform="shrink-3" />
					</div>
				</div>
			</MenuItemButton>
			<PopoverTab.Container position="bottom">
				<PopoverTab.Button
					text={t('switchAccount', { ns: 'app' })}
					onClick={() => {
						setOpen(false)
						openModal({ key: 'Accounts' })
					}}
				/>
				<PopoverTab.Button
					status="danger"
					text={t('disconnect', { ns: 'modals' })}
					onClick={() => {
						setActiveAccount(null)
						setActiveProxy(network, null)
						setOpen(false)
					}}
				/>
			</PopoverTab.Container>
		</div>
	)
}
