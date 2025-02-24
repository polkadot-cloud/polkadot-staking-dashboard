// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const MinJoinBond = () => {
  const { t } = useTranslation('pages')
  const {
    networkData: { units, unit },
  } = useNetwork()
  const { minJoinBond } = useApi().poolsConfig

  const params = {
    label: t('minimumToJoinPool'),
    value: planckToUnitBn(minJoinBond, units).toNumber(),
    decimals: 3,
    unit: ` ${unit}`,
    helpKey: 'Minimum To Join Pool',
  }
  return <Number {...params} />
}
