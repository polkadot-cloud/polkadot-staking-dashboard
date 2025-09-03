// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DefaultMenu } from './DefaultMenu'
import { FloatingtMenu } from './FloatingMenu'

export const SideMenu = () => {
	return (
		<>
			<DefaultMenu />
			<FloatingtMenu />
		</>
	)
}
