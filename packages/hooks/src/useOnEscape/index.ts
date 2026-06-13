// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react'

// Invokes `handler` whenever the Escape key is pressed. The latest handler is always used via a
// ref, so callers can pass an inline closure without re-binding the listener on every render.
export const useOnEscape = (handler: () => void) => {
	const handlerRef = useRef(handler)
	handlerRef.current = handler

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handlerRef.current()
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [])
}
