// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { MaybeString } from '@w3ux/types'
import { useCallback, useMemo, useState } from 'react'
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
	const openHelpTooltip = useCallback(
		(definition: MaybeString, anchor: HTMLButtonElement | null) => {
			setState((prev) => ({
				...prev,
				isTooltipOpen: true,
				tooltipDefinition: definition,
				tooltipAnchor: anchor,
			}))
		},
		[],
	)

	const closeHelpTooltip = useCallback(() => {
		setState((prev) => ({
			...prev,
			isTooltipOpen: false,
			tooltipDefinition: null,
			tooltipAnchor: null,
		}))
	}, [])

	const value = useMemo(
		() => ({
			openHelpTooltip,
			closeHelpTooltip,
			isTooltipOpen: state.isTooltipOpen,
			tooltipDefinition: state.tooltipDefinition,
			tooltipAnchor: state.tooltipAnchor,
		}),
		[
			openHelpTooltip,
			closeHelpTooltip,
			state.isTooltipOpen,
			state.tooltipDefinition,
			state.tooltipAnchor,
		],
	)

	return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>
}
