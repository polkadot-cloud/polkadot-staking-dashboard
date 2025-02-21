// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useTranslation } from 'react-i18next'
import type { BondedPool } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Head, Preload, Title } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const Preloader = () => {
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
          text={t('close', { ns: 'modals' })}
          size="lg"
          onClick={() => closeCanvas()}
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
      <Preload title={`${t('analyzingPoolPerformance', { ns: 'app' })}...`} />
    </>
  )
}
