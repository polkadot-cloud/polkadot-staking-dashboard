// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type { ReactNode } from 'react'

export type HelpItems = HelpItem[]

export interface HelpItem {
	key?: string
	definitions?: string[]
	external?: ExternalItems
}

export type ExternalItems = ExternalItem[]
export type ExternalItem = [string, string, string]

export interface DefinitionWithKeys {
	title: string
	description: string[]
}

export interface ExternalWithKeys {
	title: string
	url: string
	website?: string
}

export interface HelpContextInterface {
	openHelpTooltip: (
		definition: MaybeString,
		anchor: HTMLButtonElement | null,
	) => void
	closeHelpTooltip: () => void
	isTooltipOpen: boolean
	tooltipDefinition: MaybeString
	tooltipAnchor: HTMLElement | null
}

export interface HelpContextState {
	isTooltipOpen: boolean
	tooltipDefinition: MaybeString
	tooltipAnchor: HTMLElement | null
}

export interface HelpContextProps {
	children: ReactNode
}

export type HelpConfig = Record<string, string | string[]>
