// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useUi } from 'contexts/UI'
import { useState } from 'react'
import { Header } from 'ui-core/base'
import { Account } from './Account'
import { Invite } from './Invite'
import { Settings } from './Settings'
import { SideMenuToggle } from './SideMenuToggle'
import { Sync } from './Sync'

export const Headers = () => {
	const { sideMenuMinimised } = useUi()

	const [openConnect, setOpenConnect] = useState<boolean>(false)

	return (
		<Header minimized={sideMenuMinimised}>
			<section>
				<SideMenuToggle />
			</section>
			<section>
				<Sync />
				<Account openConnect={openConnect} setOpenConnect={setOpenConnect} />
				<Invite />
				<Settings openConnect={openConnect} setOpenConnect={setOpenConnect} />
			</section>
		</Header>
	)
}
