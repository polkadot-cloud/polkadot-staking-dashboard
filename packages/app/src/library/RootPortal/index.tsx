// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
//

import { type ReactNode, useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = { children: ReactNode; targetId?: string }

export function RootPortal({ children, targetId = 'root' }: Props) {
	const [mounted, setMounted] = useState(false)

	// Lazily create a host element for this portal instance
	const hostEl = useMemo(
		() =>
			typeof document !== 'undefined' ? document.createElement('div') : null,
		[],
	)

	useLayoutEffect(() => {
		if (!hostEl) return

		const doc = document
		const target = (targetId && doc.getElementById(targetId)) || doc.body // Fallback to body

		// Style hook: ensure it can float above modals
		hostEl.style.position = 'absolute'
		hostEl.style.zIndex = '99999'

		target.appendChild(hostEl)
		setMounted(true)
		return () => {
			target.removeChild(hostEl)
		}
	}, [hostEl, targetId])

	if (!mounted || !hostEl) return null
	return createPortal(children, hostEl)
}
