// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { MaybeString } from '@w3ux/types'
import { useState } from 'react'
import type {
	HelpContextInterface,
	HelpContextProps,
	HelpContextState,
} from './types'

export const [HelpContext, useHelp] = createSafeContext<HelpContextInterface>()

export const HelpProvider = ({ children }: HelpContextProps) => {
	const [state, setState] = useState<HelpContextState>({
		isTooltipOpen: false,
		tooltipDefinition: null,
		tooltipAnchor: null,
	})

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
