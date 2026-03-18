// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type {
	Prompt,
	PromptContextInterface,
	PromptSize,
	PromptState,
} from './types'

export const [PromptContext, usePrompt] =
	createSafeContext<PromptContextInterface>()

export const PromptProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useState<PromptState>({
		size: 'lg',
		status: 0,
		Prompt: null,
		onClosePrompt: null,
	})

	// Whether prompt can be closed by clicking outside on container
	const [closeOnOutsideClick, setCloseOnOutsideClick] = useState(false)

	// Stable — functional setState avoids stale state capture.
	const setPrompt = useCallback((Prompt: Prompt) => {
		setState((prev) => ({ ...prev, Prompt }))
	}, [])

	const setStatus = useCallback((status: number) => {
		setState((prev) => ({ ...prev, status }))
	}, [])

	const openPromptWith = useCallback(
		(Prompt: Prompt, size: PromptSize = 'sm', closeOutside = true) => {
			setState((prev) => ({ ...prev, size, Prompt, status: 1 }))
			setCloseOnOutsideClick(closeOutside)
		},
		[],
	)

	// Reads onClosePrompt via functional updater to avoid stale closure.
	const closePrompt = useCallback(() => {
		setState((prev) => {
			prev.onClosePrompt?.()
			return { ...prev, status: 0, Prompt: null, onClosePrompt: null }
		})
	}, [])

	const setOnClosePrompt = useCallback((onClosePrompt: (() => void) | null) => {
		setState((prev) => ({ ...prev, onClosePrompt }))
	}, [])

	const value = useMemo(
		() => ({
			setOnClosePrompt,
			openPromptWith,
			closePrompt,
			setStatus,
			setPrompt,
			setCloseOnOutsideClick,
			size: state.size,
			status: state.status,
			Prompt: state.Prompt,
			closeOnOutsideClick,
		}),
		[
			setOnClosePrompt,
			openPromptWith,
			closePrompt,
			setStatus,
			setPrompt,
			state.size,
			state.status,
			state.Prompt,
			closeOnOutsideClick,
		],
	)

	return (
		<PromptContext.Provider value={value}>{children}</PromptContext.Provider>
	)
}
