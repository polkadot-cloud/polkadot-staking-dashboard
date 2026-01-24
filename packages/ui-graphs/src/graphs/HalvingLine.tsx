// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FontSpec } from 'chart.js'
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
)

// Hard Pressure Supply Schedule Data
// Source: Polkadot Hard Pressure Model
const HALVING_SCHEDULE = [
	{ year: 2026, issuance: 55617170 },
	{ year: 2028, issuance: 41000978 },
	{ year: 2030, issuance: 30225921 },
	{ year: 2032, issuance: 22282549 },
	{ year: 2034, issuance: 16426695 },
	{ year: 2036, issuance: 12109760 },
	{ year: 2038, issuance: 8927315 },
	{ year: 2040, issuance: 6581216 },
	{ year: 2042, issuance: 4851673 },
	{ year: 2044, issuance: 3576653 },
	{ year: 2046, issuance: 2636709 },
	{ year: 2048, issuance: 1943782 },
	{ year: 2050, issuance: 1432956 },
	{ year: 2052, issuance: 1056375 },
	{ year: 2054, issuance: 778760 },
	{ year: 2056, issuance: 574102 },
	{ year: 2058, issuance: 423228 },
	{ year: 2060, issuance: 312003 },
	{ year: 2062, issuance: 230009 },
	{ year: 2064, issuance: 169563 },
	{ year: 2066, issuance: 125002 },
	{ year: 2068, issuance: 92151 },
	{ year: 2070, issuance: 67934 },
	{ year: 2072, issuance: 50081 },
	{ year: 2074, issuance: 36920 },
	{ year: 2076, issuance: 27217 },
	{ year: 2078, issuance: 20064 },
	{ year: 2080, issuance: 14792 },
]

export const HalvingLine = ({
	width,
	height,
	getThemeValue,
	labels,
}: HalvingLineProps) => {
	// Current year (2026)
	const currentYear = 2026
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

	const options = {
		responsive: true,
		maintainAspectRatio: false,
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
					callback: (value: number | string) =>
						`${(Number(value) / 1_000_000).toFixed(1)}M`,
				},
				border: {
					display: false,
				},
				grid: {
					color: getThemeValue('--grid-canvas'),
				},
				title: {
					...titleStyle,
					text: labels.issuance,
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
						return `${(value / 1_000_000).toFixed(2)}M DOT/year`
					},
				},
				intersect: false,
				interaction: {
					mode: 'nearest',
				},
			},
		},
	}

	const data = {
		labels: HALVING_SCHEDULE.map((item) => item.year.toString()),
		datasets: [
			{
				label: labels.newIssuance,
				data: HALVING_SCHEDULE.map((item) => item.issuance),
				borderColor: color,
				backgroundColor,
				pointRadius: (context: { dataIndex: number }) =>
					context.dataIndex === currentDataIndex ? 5 : 0,
				pointBackgroundColor: (context: { dataIndex: number }) =>
					context.dataIndex === currentDataIndex ? color : 'transparent',
				pointBorderColor: (context: { dataIndex: number }) =>
					context.dataIndex === currentDataIndex
						? getThemeValue('--background-primary')
						: 'transparent',
				pointBorderWidth: 2,
				borderWidth: 2,
				fill: true,
				tension: 0.4,
			},
		],
	}

	return (
		<div
			style={{
				width: width || '100%',
				height: height || 'auto',
				position: 'relative',
			}}
		>
			<Line options={options} data={data} />
		</div>
	)
}
