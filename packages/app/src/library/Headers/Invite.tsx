// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useInvites } from 'contexts/Invites'
import { useTheme } from 'contexts/Themes'
import { useSyncing } from 'hooks/useSyncing'
import { useState } from 'react'
import { ButtonHeader } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { NotificationsPopover } from './Popovers/NotificationsPopover'

export const Invite = () => {
	const { themeElementRef } = useTheme()
	const { syncing } = useSyncing(['initialization', 'bonded-pools'])
	const { inviteConfig, acknowledged, setAcknowledged } = useInvites()

	const [open, setOpen] = useState<boolean>(false)

	// Don't render if no active invite
	if (!inviteConfig || syncing) {
		return null
	}

	return (
		<Popover
			open={open}
			portalContainer={themeElementRef.current || undefined}
			content={<NotificationsPopover setOpen={setOpen} />}
			onTriggerClick={() => {
				setAcknowledged(true)
				setOpen(!open)
			}}
			width="350px"
		>
			<ButtonHeader
				className="header-invite"
				icon={faBell}
				active
				acknowledged={acknowledged}
			/>
		</Popover>
	)
}
