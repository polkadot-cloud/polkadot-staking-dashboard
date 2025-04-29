// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'

export const LastEraPayout = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { lastReward } = useApi().stakingMetrics
  const { unit, units } = getNetworkData(network)

  const lastRewardUnit = parseFloat(planckToUnit(lastReward || 0, units))

  const params = {
    label: t('lastEraPayout'),
    value: lastRewardUnit,
    decimals: 3,
    unit,
    helpKey: 'Last Era Payout',
  }
  return <Number {...params} />
}
