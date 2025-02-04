// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatBoxList/Number'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const MinimumNominatorBond = () => {
  const { t } = useTranslation('pages')
  const { unit, units } = useNetwork().networkData
  const { minNominatorBond } = useApi().stakingMetrics

  const params = {
    label: t('nominate.minimumToNominate'),
    value: planckToUnitBn(minNominatorBond, units).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey: 'Bonding',
  }

  return <Number {...params} />
}
