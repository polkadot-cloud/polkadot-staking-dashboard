// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirstLetter, rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance'
import { useTranslation } from 'react-i18next'
import type { BondedPool, PoolRewardPointsKey } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Head, Preload, Title } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'
import { JoinPoolInterfaceWrapper } from './Wrappers'

export const Preloader = ({
  performanceKey,
}: {
  performanceKey: PoolRewardPointsKey
}) => {
  const { t } = useTranslation('pages')
  const {
    network,
    networkData: { units, unit },
  } = useNetwork()
  const { bondedPools } = useBondedPools()
  const { getPoolPerformanceTask } = usePoolPerformance()
  const {
    poolsConfig: { counterForPoolMembers },
  } = useApi()
  const { closeCanvas } = useOverlay().canvas

  let totalPoolPoints = new BigNumber(0)
  bondedPools.forEach((b: BondedPool) => {
    totalPoolPoints = totalPoolPoints.plus(rmCommas(b.points))
  })
  const totalPoolPointsUnit = planckToUnitBn(totalPoolPoints, units)
    .decimalPlaces(0)
    .toFormat()

  // Get the pool performance task to determine if performance data is ready.
  const poolJoinPerformanceTask = getPoolPerformanceTask(performanceKey)
  // Calculate syncing status.
  const { startEra, currentEra, endEra } = poolJoinPerformanceTask
  const totalEras = startEra.minus(endEra)
  const erasPassed = startEra.minus(currentEra)
  const percentPassed = erasPassed.isEqualTo(0)
    ? new BigNumber(0)
    : erasPassed.dividedBy(totalEras).multipliedBy(100)

  return (
    <>
      <Head>
        <ButtonPrimary
          text={t('pools.back', { ns: 'pages' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </Head>
      <Title>
        <h1>{t('pools.pools')}</h1>
        <h3>
          {t('pools.joinPoolHeading', {
            totalMembers: new BigNumber(counterForPoolMembers).toFormat(),
            totalPoolPoints: totalPoolPointsUnit,
            unit,
            network: capitalizeFirstLetter(network),
          })}
        </h3>
      </Title>
      <JoinPoolInterfaceWrapper>
        <div className="content" style={{ flexDirection: 'column' }}>
          <Preload
            title={`${t('analyzingPoolPerformance', { ns: 'library' })}...`}
            percentPassed={percentPassed.toString()}
          />
        </div>
      </JoinPoolInterfaceWrapper>
    </>
  )
}
