// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePageFromHash } from 'hooks/usePageFromHash'
import { useEffect, useState } from 'react'
import type { NavSection } from 'types'
import { DefaultMenu } from './DefaultMenu'
import { FloatingtMenu } from './FloatingMenu'

export const SideMenu = () => {
	const { categoryKey } = usePageFromHash()

	// Define local category state to manage active category between both menu versions. Speeds up
	// re-renders compared to url changes
	const [localCategory, setLocalCategory] = useState<NavSection>(categoryKey)

	// Update category key if changed externally
	useEffect(() => {
		if (categoryKey !== localCategory) {
			setLocalCategory(categoryKey)
		}
	}, [categoryKey])

	return (
		<>
			<DefaultMenu
				localCategory={localCategory}
				setLocalCategory={setLocalCategory}
			/>
			<FloatingtMenu setLocalCategory={setLocalCategory} />
		</>
	)
}
