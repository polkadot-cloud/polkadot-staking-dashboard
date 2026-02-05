// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TimeLeftFormatted } from '@w3ux/types'

/**
 * Enumeration of available stat types
 */
export enum StatType {
	NUMBER = 'number',
	TEXT = 'text',
	PIE = 'pie',
	TIMELEFT = 'timeleft',
}

/**
 * Base properties shared by all stat configurations
 */
export interface StatConfigBase {
	label: string
	helpKey?: string
	isPreloading?: boolean
}

/**
 * Configuration for Number stat type
 * Displays a numeric value with optional decimals and unit
 */
export interface NumberStatConfig extends StatConfigBase {
	type: StatType.NUMBER
	value: number
	decimals?: number
	unit?: string
}

/**
 * Configuration for Text stat type
 * Displays a text/string value
 */
export interface TextStatConfig extends StatConfigBase {
	type: StatType.TEXT
	value: string
	primary?: boolean
}

/**
 * Configuration for Pie stat type
 * Displays a pie chart with a value
 */
export interface PieStatConfig extends StatConfigBase {
	type: StatType.PIE
	value: string | number
	unit: string
	total?: string | number
	pieValue: number
	tooltip?: string
}

/**
 * Configuration for Timeleft stat type
 * Displays a countdown with progress graph
 */
export interface TimeleftStatConfig extends StatConfigBase {
	type: StatType.TIMELEFT
	timeleft: TimeLeftFormatted
	graph: {
		value1: number
		value2: number
	}
	tooltip?: string
}

/**
 * Union type of all stat configurations
 */
export type StatConfig =
	| NumberStatConfig
	| TextStatConfig
	| PieStatConfig
	| TimeleftStatConfig

/**
 * Props for the Stats component
 */
export interface StatsProps {
	items: StatConfig[]
}
