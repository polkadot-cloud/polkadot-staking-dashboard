// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePrompt } from 'contexts/Prompt'
import { useEffect, useRef } from 'react'
import { ContentWrapper, HeightWrapper, PromptWrapper } from './Wrappers'

export const Prompt = () => {
	const {
		size,
		status,
		closePrompt,
		Prompt: PromptInner,
		closeOnOutsideClick,
	} = usePrompt()

	const dialogRef = useRef<HTMLDivElement>(null)

	// Move focus into the prompt on open and restore it to the previously focused
	// element (the trigger) when the prompt closes.
	useEffect(() => {
		if (status === 0) {
			return
		}
		const previouslyFocused = document.activeElement as HTMLElement | null
		dialogRef.current?.focus()
		return () => {
			previouslyFocused?.focus?.()
		}
	}, [status])

	if (status === 0) {
		return null
	}

	return (
		<PromptWrapper>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-label="Prompt"
				tabIndex={-1}
			>
				<HeightWrapper size={size}>
					<ContentWrapper>{PromptInner}</ContentWrapper>
				</HeightWrapper>
				<button
					type="button"
					className="close"
					onClick={() => {
						if (closeOnOutsideClick) {
							closePrompt()
						}
					}}
					aria-label="Close"
					tabIndex={-1}
				>
					&nbsp;
				</button>
			</div>
		</PromptWrapper>
	)
}
