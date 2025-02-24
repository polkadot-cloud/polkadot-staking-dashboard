// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { usePoolCommission } from 'hooks/usePoolCommission'
import { Header } from 'library/Announcements/Header'
import type { PoolStatLabel } from 'library/Announcements/types'
import { Wrapper } from 'library/Announcements/Wrappers'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
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
      stateDisplay = t('locked')
      break
    case 'Destroying':
      stateDisplay = t('destroying')
      break
    default:
      stateDisplay = t('open')
      break
  }

  const items: PoolStatLabel[] = [
    {
      label: t('poolState'),
      value: stateDisplay,
    },
  ]

  if (currentCommission) {
    items.push({
      label: t('poolCommission'),
      value: `${currentCommission}%`,
    })
  }

  items.push(
    {
      label: t('poolMembers'),
      value: `${memberCounter}`,
      button: pluginEnabled('subscan')
        ? {
            text: t('browseMembers'),
            onClick: () => {
              openCanvas({ key: 'PoolMembers', size: 'xl' })
            },
            disabled: memberCounter === '0',
          }
        : undefined,
    },
    {
      label: t('totalBonded'),
      value: `${bonded} ${unit}`,
    }
  )

  return (
    <CardWrapper style={{ boxShadow: 'var(--card-shadow-secondary)' }}>
      <CardHeader margin>
        <h3>{t('poolStats')}</h3>
      </CardHeader>
      <Wrapper>
        <Header items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  )
}
