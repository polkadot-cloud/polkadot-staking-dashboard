// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirstLetter, rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { PoolSyncBar } from 'library/PoolSync/Bar'
import { useTranslation } from 'react-i18next'
import type { BondedPool, PoolRewardPointsKey } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Head, Title } from 'ui-core/canvas'
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
          <h2 className="tip">
            {t('analyzingPoolPerformance', { ns: 'library' })}...
          </h2>

          <h2 className="tip">
            <PoolSyncBar performanceKey={performanceKey} />
          </h2>
        </div>
      </JoinPoolInterfaceWrapper>
    </>
  )
}
