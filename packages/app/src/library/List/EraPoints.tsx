// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ErasRewardPoints } from 'api/subscribe/erasRewardPoints'
import type { EraRewardPointsEvent } from 'api/types'
import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useTooltip } from 'contexts/Tooltip'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { Subscriptions } from 'controllers/Subscriptions'
import { isCustomEvent } from 'controllers/utils'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Graph } from 'ui-core/list'
import { useEventListener } from 'usehooks-ts'
import type { EraPointsInnerProps, EraPointsProps } from './types'
import { normaliseEraPoints } from './Utils'

export const EraPoints = ({ address, displayFor }: EraPointsProps) => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { isReady, activeEraRef } = useApi()
  const { validatorsFetched } = useValidators()
  const { setTooltipTextAndOpen } = useTooltip()

  const subscription = Subscriptions.get(
    network,
    'erasRewardPoints'
  ) as ErasRewardPoints

  // Era points value.
  const [eraPoints, setEraPoints] = useState<BigNumber>(
    new BigNumber(subscription?.getIndividualEraPoints(address) || 0)
  )

  // Highest performing validator points for current era
  const [eraHigh, setEraHigh] = useState<number>(subscription?.eraHigh || 1)

  // Normalise era point data for graph
  const normalisedPoints = normaliseEraPoints(
    {
      [String(activeEraRef.current.index)]: eraPoints,
    },
    new BigNumber(eraHigh)
  )
  const normalisedPoint = Object.values(normalisedPoints)[0]
  const syncing = !isReady || !validatorsFetched || eraHigh <= 1
  const tooltipText = t('eraRewardPoints', {
    ns: 'library',
    points: eraPoints.toFormat(),
  })

  const handleEraRewardPoints = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { eraRewardPoints, eraHigh: eventEraHigh } =
        e.detail as EraRewardPointsEvent

      const individual = Object.values(eraRewardPoints.individual)
      const entry = individual.find((item) => item[0] === address)
      const newEraPoints = new BigNumber(entry?.[1] || 0)
      setEraPoints(newEraPoints)
      setEraHigh(eventEraHigh)
    }
  }

  useEventListener(
    'new-era-reward-points',
    handleEraRewardPoints,
    useRef<Document>(document)
  )

  return (
    <Graph syncing={syncing} canvas={displayFor === 'canvas'}>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <GraphInner
        value={normalisedPoint}
        syncing={syncing}
        displayFor={displayFor}
      />
    </Graph>
  )
}

const GraphInner = ({ value, syncing, displayFor }: EraPointsInnerProps) => {
  // Prefill with duplicate of start point.
  const points = Array(3).fill(value)

  const totalSegments = points.length - 2
  const vbWidth = 520
  const vbHeight = 115
  const xPadding = 0
  const yPadding = 10
  const xArea = vbWidth - 2 * xPadding
  const yArea = vbHeight - 2 * yPadding
  const xSegment = xArea / totalSegments
  let xCursor = xPadding

  const pointsCoords = points.map((point: number, index: number) => {
    const coord = {
      x: xCursor,
      y: vbHeight - yPadding - yArea * point,
      zero: point === 0,
    }
    if (index === 0 || index === points.length - 2) {
      xCursor += xSegment * 0.5
    } else {
      xCursor += xSegment
    }
    return coord
  })

  const lineCoords = []
  for (let i = 0; i <= pointsCoords.length - 1; i++) {
    const startZero = pointsCoords[i].zero
    const endZero = pointsCoords[i + 1]?.zero

    lineCoords.push({
      x1: pointsCoords[i].x,
      y1: pointsCoords[i].y,
      x2: pointsCoords[i + 1]?.x || pointsCoords[i].x,
      y2: pointsCoords[i + 1]?.y || pointsCoords[i].y,
      zero: startZero && endZero,
    })
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {lineCoords.map(({ x1 }, index) => {
        if (index === 0 || index === lineCoords.length - 1) {
          return <Fragment key={`grid_y_coord_${index}`} />
        }
        return (
          <line
            key={`grid_coord_${index}`}
            strokeWidth={4}
            stroke={
              displayFor === 'canvas'
                ? 'var(--grid-color-secondary)'
                : 'var(--grid-color-primary)'
            }
            x1={x1}
            y1={0}
            x2={x1}
            y2={vbHeight}
          />
        )
      })}

      {!syncing &&
        [{ y1: vbHeight * 0.5, y2: vbHeight * 0.5 }].map(
          ({ y1, y2 }, index) => (
            <line
              key={`grid_coord_${index}`}
              strokeWidth={4}
              stroke={
                displayFor === 'canvas'
                  ? 'var(--grid-color-secondary)'
                  : 'var(--grid-color-primary)'
              }
              x1={0}
              y1={y1}
              x2={vbWidth}
              y2={y2}
              opacity={0.5}
            />
          )
        )}

      {!syncing &&
        lineCoords.map(({ x1, y1, x2, y2, zero }, index) => {
          const startOrEnd = index === 0 || index === lineCoords.length - 2
          const opacity = startOrEnd ? 1 : zero ? 0.5 : 1
          return (
            <line
              key={`line_coord_${index}`}
              strokeWidth={5.5}
              opacity={opacity}
              stroke={
                zero
                  ? 'var(--text-color-tertiary)'
                  : 'var(--accent-color-primary)'
              }
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          )
        })}
    </svg>
  )
}
