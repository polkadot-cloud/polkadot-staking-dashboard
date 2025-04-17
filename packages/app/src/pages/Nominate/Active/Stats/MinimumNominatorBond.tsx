// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const MinimumNominatorBond = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { minNominatorBond } = useApi().stakingMetrics
  const { unit, units } = getNetworkData(network)

  const params = {
    label: t('minimumToNominate'),
    value: planckToUnitBn(minNominatorBond, units).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey: 'Bonding',
  }

  return <Number {...params} />
}
