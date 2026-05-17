// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { Chart } from 'chart.js'
import { color } from 'chart.js/helpers'
import type { AnnotationOptions } from 'chartjs-plugin-annotation'
import { fromUnixTime, getUnixTime } from 'date-fns'
import { planckToUnitBn, startOfUTCDay } from 'utils'

type BuildPoolShareAnnotationsArgs = {
	graphPayouts: { timestamp: number }[]
	poolShareRewards?: { timestamp: number; reward: string }[]
	getThemeValue: (key: string) => string
	unit: string
	units: number
	poolShareLabel: string
}

export const buildPoolShareAnnotations = ({
	graphPayouts,
	poolShareRewards,
	getThemeValue,
	unit,
	units,
	poolShareLabel,
}: BuildPoolShareAnnotationsArgs): Record<string, AnnotationOptions> => {
	if (!poolShareRewards?.length) {
		return {}
	}

	const indexByDay = new Map<number, number>()
	graphPayouts.forEach(({ timestamp }, index) => {
		indexByDay.set(timestamp, index)
	})

	const totalsByIndex = new Map<number, BigNumber>()
	for (const { timestamp, reward } of poolShareRewards) {
		const dayTs = getUnixTime(startOfUTCDay(fromUnixTime(timestamp)))
		const index = indexByDay.get(dayTs)
		if (index === undefined) {
			continue
		}
		const previous = totalsByIndex.get(index) ?? new BigNumber(0)
		totalsByIndex.set(index, previous.plus(reward))
	}

	const lineColor = getThemeValue('--gray-900')
	const barColor = color(lineColor).alpha(0.75).rgbString()
	const annotations: Record<string, AnnotationOptions> = {}
	// Half-width of the vertical bar in category units (1 = full slot width).
	const barHalfWidth = 0.09

	for (const [index, planckTotal] of totalsByIndex) {
		const value = planckToUnitBn(planckTotal, units).toNumber()
		if (value <= 0) {
			continue
		}

		const tipId = `poolShare-tip-${index}`
		const tipContent = `${poolShareLabel}: ${new BigNumber(value).decimalPlaces(units).toFormat()} ${unit}`

		const toggleTip = (chart: Chart, display: boolean) => {
			const tip = chart.options.plugins?.annotation?.annotations as
				| Record<string, AnnotationOptions>
				| undefined
			if (tip?.[tipId]) {
				;(tip[tipId] as AnnotationOptions<'label'>).display = display
				chart.update('none')
			}
		}

		const boxAnnotation: AnnotationOptions<'box'> = {
			type: 'box',
			xMin: index - barHalfWidth,
			xMax: index + barHalfWidth,
			yMin: 0,
			yMax: value,
			backgroundColor: barColor,
			borderColor: barColor,
			borderWidth: 0,
			borderRadius: {
				topLeft: 4,
				topRight: 4,
				bottomLeft: 0,
				bottomRight: 0,
			},
			enter: ({ chart }) => {
				toggleTip(chart, true)
				return true
			},
			leave: ({ chart }) => {
				toggleTip(chart, false)
				return true
			},
		}

		const tipAnnotation: AnnotationOptions<'label'> = {
			type: 'label',
			display: false,
			xValue: index,
			yValue: value,
			yAdjust: -14,
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			color: '#ffffff',
			font: { size: 11, weight: 'bold' },
			padding: { top: 4, right: 6, bottom: 4, left: 6 },
			borderRadius: 4,
			content: tipContent,
		}

		annotations[`poolShare-${index}`] = boxAnnotation
		annotations[tipId] = tipAnnotation
	}

	return annotations
}
