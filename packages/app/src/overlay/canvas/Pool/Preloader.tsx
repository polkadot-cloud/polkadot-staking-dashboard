// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useTranslation } from 'react-i18next'
import type { BondedPool } from 'types'
import { Head, Preload, Title } from 'ui-core/canvas'
import { CloseCanvas } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const Preloader = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { bondedPools } = useBondedPools()
  const {
    poolsConfig: { counterForPoolMembers },
  } = useApi()
  const { unit, units } = getNetworkData(network)

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
        <CloseCanvas />
      </Head>
      <Title>
        <h1>{t('pools')}</h1>
        <h3>
          {t('joinPoolHeading', {
            totalMembers: new BigNumber(counterForPoolMembers).toFormat(),
            totalPoolPoints: totalPoolPointsUnit,
            unit,
            network: capitalizeFirstLetter(network),
          })}
        </h3>
      </Title>
      <Preload title={`${t('analyzingPoolPerformance', { ns: 'app' })}...`} />
    </>
  )
}
