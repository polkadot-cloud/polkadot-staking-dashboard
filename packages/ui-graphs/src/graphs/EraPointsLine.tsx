// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { FontSpec } from 'chart.js'
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import { format, fromUnixTime } from 'date-fns'
import { Line } from 'react-chartjs-2'
import { Spinner } from 'ui-core/base'
import type { EraPointsLineProps } from '../types'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
)

export const EraPointsLine = ({
	entries,
	syncing,
	width,
	height,
	getThemeValue,
	dateFormat,
	labels,
}: EraPointsLineProps) => {
	// Format reward points as an array of strings, or an empty array if syncing
	const dataset = syncing
		? []
		: entries.map((entry) => new BigNumber(entry.points).toString())

	// Use primary color for line
	const color = getThemeValue('--accent-color-primary')
	// Styling of axis titles
	const titleFontSpec: Partial<FontSpec> = {
		family: "'Inter', 'sans-serif'",
		weight: 'lighter',
		size: 11,
	}
	const titleStyle = {
		color: getThemeValue('--text-color-secondary'),
		display: true,
		padding: 6,
		font: titleFontSpec,
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					color: getThemeValue('--grid-canvas-axis'),
					font: {
						size: 10,
					},
					autoSkip: true,
				},
				title: {
					...titleStyle,
					text: labels.date,
				},
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: getThemeValue('--grid-canvas-axis'),
					font: {
						size: 10,
					},
				},
				border: {
					display: false,
				},
				grid: {
					color: getThemeValue('--grid-canvas'),
				},
				title: {
					...titleStyle,
					text: labels.eraPoints,
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			},
			tooltip: {
				displayColors: false,
				backgroundColor: getThemeValue('--background-invert'),
				titleColor: getThemeValue('--text-color-invert'),
				bodyColor: getThemeValue('--text-color-invert'),
				bodyFont: {
					weight: 600,
				},
				callbacks: {
					title: () => [],
					label: (context: { parsed: { y: number | null } }) =>
						`${new BigNumber(context.parsed.y ?? 0).decimalPlaces(0).toFormat()} ${labels.eraPoints}`,
				},
				intersect: false,
				interaction: {
					mode: 'nearest',
				},
			},
		},
	}

	const data = {
		labels: entries.map(({ start }: { start: number }) => {
			const dateObj = format(fromUnixTime(start), 'do MMM', {
				locale: dateFormat,
			})
			return `${dateObj}`
		}),
		datasets: [
			{
				label: labels.era,
				data: dataset,
				borderColor: color,
				backgroundColor: color,
				pointRadius: 0,
				borderRadius: 3,
			},
		],
	}

	return (
		<div
			className="inner"
			style={{
				width,
				height,
			}}
		>
			{syncing && (
				<Spinner
					style={{ position: 'absolute', right: '3rem', top: '-4rem' }}
				/>
			)}
			<Line options={options} data={data} />
		</div>
	)
}
