// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TimeLeftFormatted } from '@w3ux/types'
import type { ReactNode } from 'react'

export interface NumberProps {
	label: string
	value: number
	decimals?: number
	unit: string
	helpKey?: string
	isPreloading?: boolean
}

export interface PieProps {
	isPreloading?: boolean
	label: string
	stat: {
		value: string | number
		unit: string | number
		total?: string | number
	}
	pieValue: number
	tooltip?: string
	helpKey?: string
}

export interface TextProps {
	isPreloading?: boolean
	primary?: boolean
	label: string
	value: string
	helpKey?: string
}

export interface TickerProps {
	isPreloading?: boolean
	primary?: boolean
	label: string
	value: string
	helpKey?: string
	direction?: 'up' | 'down'
	unit: string
	changePercent: string
}

export interface TimeleftProps {
	isPreloading?: boolean
	label: string
	timeleft: TimeLeftFormatted
	graph: {
		value1: number
		value2: number
	}
	tooltip?: string
	helpKey?: string
}

export interface ButtonProps {
	isPreloading?: boolean
	Icon: ReactNode
	label: string
	title: string
	onClick: () => void
}
