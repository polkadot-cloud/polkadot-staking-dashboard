// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Number } from 'library/StatCards/Number'
import { Pie } from 'library/StatCards/Pie'
import { Text } from 'library/StatCards/Text'
import { Timeleft } from 'library/StatCards/Timeleft'
import type { StatConfig, StatsProps } from './types'

/**
 * Renders a single stat based on its configuration type
 */
const StatItem = ({ config }: { config: StatConfig }) => {
	const { type, id, label, helpKey, isPreloading } = config

	switch (type) {
		case 'number':
			return (
				<Number
					key={id}
					label={label}
					value={config.value}
					decimals={config.decimals}
					unit={config.unit || ''}
					helpKey={helpKey}
					isPreloading={isPreloading}
				/>
			)

		case 'text':
			return (
				<Text
					key={id}
					label={label}
					value={config.value}
					primary={config.primary}
					helpKey={helpKey}
					isPreloading={isPreloading}
				/>
			)

		case 'pie':
			return (
				<Pie
					key={id}
					label={label}
					stat={{
						value: config.value,
						unit: config.unit,
						total: config.total,
					}}
					pieValue={config.pieValue}
					tooltip={config.tooltip}
					helpKey={helpKey}
					isPreloading={isPreloading}
				/>
			)

		case 'timeleft':
			return (
				<Timeleft
					key={id}
					label={label}
					timeleft={config.timeleft}
					graph={config.graph}
					tooltip={config.tooltip}
					helpKey={helpKey}
					isPreloading={isPreloading}
				/>
			)

		default:
			return null
	}
}

/**
 * Data-driven Stats component that renders stat cards based on configuration.
 *
 * Usage:
 * ```tsx
 * <Stat.Row>
 *   <Stats items={[
 *     { id: 'count', type: 'number', label: 'Active Pools', value: 100, helpKey: 'Active Pools' },
 *     { id: 'rate', type: 'text', label: 'Reward Rate', value: '5.2%', primary: true },
 *   ]} />
 * </Stat.Row>
 * ```
 */
export const Stats = ({ items }: StatsProps) => (
	<>
		{items.map((config) => (
			<StatItem key={config.id} config={config} />
		))}
	</>
)
