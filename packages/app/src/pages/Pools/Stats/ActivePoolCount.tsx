// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'

export const ActivePoolCount = () => {
  const { t } = useTranslation('pages')
  const { counterForBondedPools } = useApi().poolsConfig

  const params = {
    label: t('activePools'),
    value: counterForBondedPools,
    unit: '',
    helpKey: 'Active Pools',
  }
  return <Number {...params} />
}
