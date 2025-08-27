// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOnResize, useOutsideAlerter } from '@w3ux/hooks'
import { PageWidthMediumThreshold } from 'consts'
import { useUi } from 'contexts/UI'
import { useRef } from 'react'
import { DefaultMenu } from './DefaultMenu'
import { FloatingtMenu } from './FloatingMenu'

export const SideMenu = () => {
	const { setSideMenu } = useUi()

	// Listen to window resize to automatically hide the side menu on window resize.
	useOnResize(() => {
		if (window.innerWidth >= PageWidthMediumThreshold) {
			setSideMenu(false)
		}
	})

	// Define side menu ref and close the side menu when clicking outside of it.
	const ref = useRef<HTMLDivElement | null>(null)
	useOutsideAlerter(ref, () => {
		setSideMenu(false)
	})

	return (
		<>
			<DefaultMenu />
			<FloatingtMenu />
		</>
	)
}
