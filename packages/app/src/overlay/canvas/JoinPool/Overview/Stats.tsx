// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PoolPointsToBalance } from 'api/runtimeApi/poolPointsToBalance'
import BigNumber from 'bignumber.js'
import { MaxEraRewardPointsEras } from 'consts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance'
import { Apis } from 'controllers/Apis'
import { PoolSync } from 'library/PoolSync'
import { StyledLoader } from 'library/PoolSync/Loader'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CSSProperties } from 'styled-components'
import { Stat, Subheading } from 'ui-core/canvas'
import { planckToUnitBn } from 'utils'
import type { OverviewSectionProps } from '../types'

export const Stats = ({
  bondedPool,
  performanceKey,
  graphSyncing,
}: OverviewSectionProps) => {
  const { t } = useTranslation('library')
  const {
    network,
    networkData: {
      units,
      unit,
      brand: { token: Token },
    },
  } = useNetwork()
  const { isReady } = useApi()
  const { getPoolRewardPoints } = usePoolPerformance()
  const poolRewardPoints = getPoolRewardPoints(performanceKey)
  const rawEraRewardPoints = Object.values(
    poolRewardPoints[bondedPool.addresses.stash] || {}
  )

  // Store the pool balance.
  const [poolBalance, setPoolBalance] = useState<BigNumber | null>(null)

  // Fetches the balance of the bonded pool.
  const getPoolBalance = async () => {
    const api = Apis.getApi(network)
    if (!api) {
      return
    }

    const apiResult = await new PoolPointsToBalance(
      network,
      bondedPool.id,
      BigInt(bondedPool.points)
    ).fetch()
    const balance = new BigNumber(apiResult?.toString() || 0)

    if (balance) {
      setPoolBalance(new BigNumber(balance))
    }
  }

  // Fetch the balance when pool or points change.
  useEffect(() => {
    if (isReady) {
      getPoolBalance()
    }
  }, [bondedPool.id, bondedPool.points, isReady])

  const vars = {
    '--loader-color': 'var(--text-color-secondary)',
  } as CSSProperties

  return (
    <Subheading>
      <h4>
        {graphSyncing ? (
          <Stat>
            {t('syncing')}
            <StyledLoader style={{ ...vars, marginRight: '1.25rem' }} />
            <PoolSync performanceKey={performanceKey} />
          </Stat>
        ) : (
          <>
            {rawEraRewardPoints.length === MaxEraRewardPointsEras && (
              <Stat>{t('activelyNominating')}</Stat>
            )}
            <Stat withIcon>
              <Token />
              <span>
                {!poolBalance
                  ? `...`
                  : `${planckToUnitBn(poolBalance, units)
                      .decimalPlaces(3)
                      .toFormat()} ${unit} ${t('bonded')}`}
              </span>
            </Stat>
          </>
        )}
      </h4>
    </Subheading>
  )
}
