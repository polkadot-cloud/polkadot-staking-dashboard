// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const MinCreateBond = () => {
  const { t } = useTranslation('pages')
  const {
    networkData: { units, unit },
  } = useNetwork()
  const { minCreateBond } = useApi().poolsConfig

  const params = {
    label: t('minimumToCreatePool'),
    value: planckToUnitBn(minCreateBond, units).toNumber(),
    decimals: 3,
    unit,
    helpKey: 'Minimum To Create Pool',
  }
  return <Number {...params} />
}
