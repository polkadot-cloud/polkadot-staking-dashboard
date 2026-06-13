// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePrompt } from 'contexts/Prompt'
import { useOnEscape } from 'hooks'
import { useOverlay } from 'ui-overlay'

// Closes the topmost open overlay when the Escape key is pressed. Centralised
// here because modals and canvases live in the overlay context while prompts
// live in a separate context, and prompts render on top of modals/canvases.
export const OverlayKeyboardControls = () => {
	const {
		modal: { status: modalStatus, closeModal },
		canvas: { status: canvasStatus, closeCanvas },
	} = useOverlay()
	const { status: promptStatus, closePrompt, closeOnOutsideClick } = usePrompt()

	useOnEscape(() => {
		// Prompt is the topmost layer
		if (promptStatus !== 0) {
			if (closeOnOutsideClick) {
				closePrompt()
			}
			return
		}
		// Canvas sits above the modal
		if (canvasStatus === 'open') {
			closeCanvas()
			return
		}
		// Modal is the base overlay layer
		if (modalStatus === 'open' || modalStatus === 'opening') {
			closeModal()
		}
	})

	return null
}
