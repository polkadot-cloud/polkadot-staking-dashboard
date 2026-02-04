// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TimeLeftFormatted } from '@w3ux/types'

/**
 * Base properties shared by all stat configurations
 */
export interface StatConfigBase {
	id: string
	label: string
	helpKey?: string
	isPreloading?: boolean
}

/**
 * Configuration for Number stat type
 * Displays a numeric value with optional decimals and unit
 */
export interface NumberStatConfig extends StatConfigBase {
	type: 'number'
	value: number
	decimals?: number
	unit?: string
}

/**
 * Configuration for Text stat type
 * Displays a text/string value
 */
export interface TextStatConfig extends StatConfigBase {
	type: 'text'
	value: string
	primary?: boolean
}

/**
 * Configuration for Pie stat type
 * Displays a pie chart with a value
 */
export interface PieStatConfig extends StatConfigBase {
	type: 'pie'
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
	type: 'timeleft'
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
