// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Graph } from 'ui-core/list'
import { useEventListener } from 'usehooks-ts'
import type { CurrentEraPointsProps } from '../types'
import { normaliseEraPoints } from '../Utils'
import { Inner } from './Inner'

export const CurrentEraPoints = ({
  address,
  displayFor,
}: CurrentEraPointsProps) => {
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
      <Inner
        points={Array(7).fill(normalisedPoint)}
        syncing={syncing}
        displayFor={displayFor}
      />
    </Graph>
  )
}
