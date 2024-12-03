// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { usePoolCommission } from 'hooks/usePoolCommission'
import { useOverlay } from 'kits/Overlay/Provider'
import { Header } from 'library/Announcements/Header'
import type { PoolStatLabel } from 'library/Announcements/types'
import { Wrapper } from 'library/Announcements/Wrappers'
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'
import { Announcements } from './Announcements'

export const PoolStats = () => {
  const { t } = useTranslation('pages')
  const { openCanvas } = useOverlay().canvas
  const {
    networkData: { units, unit },
  } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { activePool } = useActivePool()
  const { getCurrentCommission } = usePoolCommission()

  const poolId = activePool?.id || 0

  const { state, points, memberCounter } = activePool?.bondedPool || {}
  const currentCommission = getCurrentCommission(poolId)

  const bonded = planckToUnitBn(
    new BigNumber(points ? rmCommas(points) : 0),
    units
  )
    .decimalPlaces(3)
    .toFormat()

  let stateDisplay
  switch (state) {
    case 'Blocked':
      stateDisplay = t('pools.locked')
      break
    case 'Destroying':
      stateDisplay = t('pools.destroying')
      break
    default:
      stateDisplay = t('pools.open')
      break
  }

  const items: PoolStatLabel[] = [
    {
      label: t('pools.poolState'),
      value: stateDisplay,
    },
  ]

  if (currentCommission) {
    items.push({
      label: t('pools.poolCommission'),
      value: `${currentCommission}%`,
    })
  }

  items.push(
    {
      label: t('pools.poolMembers'),
      value: `${memberCounter}`,
      button: pluginEnabled('subscan')
        ? {
            text: t('pools.browseMembers'),
            onClick: () => {
              openCanvas({ key: 'PoolMembers', size: 'xl' })
            },
            disabled: memberCounter === '0',
          }
        : undefined,
    },
    {
      label: t('pools.totalBonded'),
      value: `${bonded} ${unit}`,
    }
  )

  return (
    <CardWrapper style={{ boxShadow: 'var(--card-shadow-secondary)' }}>
      <CardHeaderWrapper $withMargin>
        <h3>{t('pools.poolStats')}</h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  )
}
