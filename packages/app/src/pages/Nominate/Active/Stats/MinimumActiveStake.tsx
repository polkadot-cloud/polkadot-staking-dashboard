// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatBoxList/Number'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const MinimumActiveStakeStat = () => {
  const { t } = useTranslation('pages')
  const {
    networkData: { unit, units },
  } = useNetwork()
  const { minimumActiveStake } = useApi().networkMetrics

  const params = {
    label: t('nominate.minimumToEarnRewards'),
    value: planckToUnitBn(minimumActiveStake, units).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey: 'Bonding',
  }

  return <Number {...params} />
}
