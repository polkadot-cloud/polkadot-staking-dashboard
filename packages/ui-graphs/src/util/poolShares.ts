// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
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

	const lineColor = getThemeValue('--gray-800')
	const annotations: Record<string, AnnotationOptions> = {}

	for (const [index, planckTotal] of totalsByIndex) {
		const value = planckToUnitBn(planckTotal, units).toNumber()
		if (value <= 0) {
			continue
		}

		const lineAnnotation: AnnotationOptions<'line'> = {
			type: 'line',
			xMin: index,
			xMax: index,
			yMin: 0,
			yMax: value,
			init: ({ properties }) => ({
				...properties,
				y2: properties.y,
			}),
			borderColor: lineColor,
			borderWidth: 3,
			label: {
				display: false,
				position: 'start',
				yAdjust: -8,
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				color: '#ffffff',
				font: { size: 11, weight: 'bold' },
				padding: { top: 4, right: 6, bottom: 4, left: 6 },
				borderRadius: 4,
				content: `${poolShareLabel}: ${new BigNumber(value).decimalPlaces(units).toFormat()} ${unit}`,
			},
			enter: ({ element }) => {
				if (element.label) {
					element.label.options.display = true
				}
				return true
			},
			leave: ({ element }) => {
				if (element.label) {
					element.label.options.display = false
				}
				return true
			},
		}
		annotations[`poolShare-${index}`] = lineAnnotation
	}

	return annotations
}
