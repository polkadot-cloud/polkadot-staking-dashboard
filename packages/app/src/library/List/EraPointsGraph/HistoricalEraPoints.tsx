// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useTooltip } from 'contexts/Tooltip'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useErasPerDay } from 'hooks/useErasPerDay'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Graph } from 'ui-core/list'
import type { EraPointsHistoricalProps } from '../types'
import { normaliseEraPoints, prefillEraPoints } from '../Utils'
import { Inner } from './Inner'

export const HistoricalEraPoints = ({
  displayFor,
  eraPoints,
}: EraPointsHistoricalProps) => {
  const { t } = useTranslation('library')
  const { isReady } = useApi()
  const { erasPerDay } = useErasPerDay()
  const { validatorsFetched } = useValidators()
  const { setTooltipTextAndOpen } = useTooltip()

  const eraPointData: bigint[] = eraPoints.map(({ points }) => BigInt(points))
  const high = eraPointData.sort((a, b) => Number(b - a))[0]

  const normalisedPoints = normaliseEraPoints(
    Object.fromEntries(
      eraPoints.map(({ era, points }) => [
        era,
        new BigNumber(points.toString()),
      ])
    ),
    new BigNumber(high?.toString() || 1)
  )
  const prefilledPoints = prefillEraPoints(Object.values(normalisedPoints))
  const syncing = !isReady || !eraPoints.length || !validatorsFetched
  const tooltipText = t('validatorPerformance', {
    count: Math.ceil(30 / erasPerDay.toNumber()),
  })

  return (
    <Graph syncing={syncing} canvas={displayFor === 'canvas'}>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <Inner
        points={prefilledPoints}
        syncing={syncing}
        displayFor={displayFor}
      />
    </Graph>
  )
}
