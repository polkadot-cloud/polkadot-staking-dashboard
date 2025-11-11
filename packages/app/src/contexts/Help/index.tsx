// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import type { MaybeString } from '@w3ux/types'
import { useState } from 'react'
import type {
	HelpContextInterface,
	HelpContextProps,
	HelpContextState,
	HelpStatus,
} from './types'

export const [HelpContext, useHelp] = createSafeContext<HelpContextInterface>()

export const HelpProvider = ({ children }: HelpContextProps) => {
	const [state, setState] = useState<HelpContextState>({
		status: 'closed',
		definition: null,
		// New tooltip state
		isTooltipOpen: false,
		tooltipDefinition: null,
		tooltipAnchor: null,
	})

	// When fade out completes, reset active definition
	useEffectIgnoreInitial(() => {
		if (state.status === 'closed') {
			setState({
				...state,
				definition: null,
			})
		}
	}, [state.status])

	const setDefinition = (definition: MaybeString) => {
		setState({
			...state,
			definition,
		})
	}

	const setStatus = (newStatus: HelpStatus) => {
		setState({
			...state,
			status: newStatus,
		})
	}

	const openHelp = (definition: MaybeString) => {
		setState({
			...state,
			definition,
			status: 'open',
		})
	}

	const closeHelp = () => {
		setState({
			...state,
			status: 'closing',
		})
	}

	// New tooltip-based help functions
	const openHelpTooltip = (
		definition: MaybeString,
		anchor: HTMLButtonElement | null,
	) => {
		setState({
			...state,
			isTooltipOpen: true,
			tooltipDefinition: definition,
			tooltipAnchor: anchor,
		})
	}

	const closeHelpTooltip = () => {
		setState({
			...state,
			isTooltipOpen: false,
			tooltipDefinition: null,
			tooltipAnchor: null,
		})
	}

	return (
		<HelpContext.Provider
			value={{
				openHelp,
				closeHelp,
				setStatus,
				setDefinition,
				status: state.status,
				definition: state.definition,
				// New tooltip API
				openHelpTooltip,
				closeHelpTooltip,
				isTooltipOpen: state.isTooltipOpen,
				tooltipDefinition: state.tooltipDefinition,
				tooltipAnchor: state.tooltipAnchor,
			}}
		>
			{children}
		</HelpContext.Provider>
	)
}
