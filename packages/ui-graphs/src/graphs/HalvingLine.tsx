// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChartOptions, FontSpec } from 'chart.js'
import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { HALVING_SCHEDULE } from 'consts/halving'
import { Line } from 'react-chartjs-2'
import type { HalvingLineProps } from '../types'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	annotationPlugin,
)

export const HalvingLine = ({
	getThemeValue,
	label,
	tooltipLabel,
	millionUnit,
}: HalvingLineProps) => {
	const currentYear = new Date().getFullYear()
	const currentDataIndex = HALVING_SCHEDULE.findIndex(
		(item) => item.year === currentYear,
	)

	// Use primary color for line
	const color = getThemeValue('--accent-primary')
	const backgroundColor =
		getThemeValue('--accent-primary')
			.replace(')', ', 0.1)')
			.replace('rgb', 'rgba') || 'rgba(56, 113, 220, 0.1)'

	// Styling of axis titles
	const titleFontSpec: Partial<FontSpec> = {
		family: "'Inter', 'sans-serif'",
		weight: 'lighter',
		size: 11,
	}
	const titleStyle = {
		color: getThemeValue('--text-tertiary'),
		display: true,
		padding: 6,
		font: titleFontSpec,
	}

	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: 'nearest',
			intersect: false,
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					color: getThemeValue('--text-tertiary'),
					font: {
						size: 10,
					},
					autoSkip: true,
					maxTicksLimit: 10,
				},
				title: {
					display: false,
				},
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: getThemeValue('--text-tertiary'),
					font: {
						size: 10,
					},
					autoSkip: true,
					maxTicksLimit: 6,
					callback: (value: number | string) =>
						`${(Number(value) / 1_000_000).toFixed(1)}${millionUnit}`,
				},
				border: {
					display: false,
				},
				grid: {
					color: getThemeValue('--grid-secondary'),
				},
				title: {
					...titleStyle,
					text: label,
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
				mode: 'nearest',
				displayColors: false,
				backgroundColor: getThemeValue('--bg-invert'),
				titleColor: getThemeValue('--text-invert'),
				bodyColor: getThemeValue('--text-invert'),
				bodyFont: {
					weight: 600,
				},
				callbacks: {
					title: () => [],
					label: (context: { parsed: { y: number | null } }) => {
						const value = context.parsed.y ?? 0
						return tooltipLabel(value)
					},
				},
			},
			annotation: {
				annotations: {
					currentYearLine: {
						type: 'line',
						xMin: currentDataIndex,
						xMax: currentDataIndex,
						borderColor: getThemeValue('--accent-primary'),
						borderWidth: 2,
						borderDash: [5, 5],
						label: {
							display: false,
						},
					},
				},
			},
		},
	}

	const data = {
		labels: HALVING_SCHEDULE.map((item) => item.year.toString()),
		datasets: [
			{
				label,
				data: HALVING_SCHEDULE.map((item) => item.issuance),
				borderColor: color,
				backgroundColor,
				pointRadius: (context: { dataIndex: number }) =>
					context.dataIndex === currentDataIndex ? 5 : 0,
				pointHoverRadius: 4,
				pointHitRadius: 4,
				pointBackgroundColor: (context: { dataIndex: number }) =>
					context.dataIndex === currentDataIndex ? color : 'transparent',
				pointHoverBackgroundColor: color,
				pointBorderColor: 'transparent',
				pointHoverBorderColor: color,
				pointBorderWidth: 2,
				borderWidth: 2,
				fill: true,
				stepped: 'after' as const,
			},
		],
	}

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
			}}
		>
			<Line options={options} data={data} />
		</div>
	)
}
