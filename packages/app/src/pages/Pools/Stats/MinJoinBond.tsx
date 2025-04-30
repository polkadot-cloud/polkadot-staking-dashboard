// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'

export const MinJoinBond = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { minJoinBond } = useApi().poolsConfig
  const { unit, units } = getNetworkData(network)
  const params = {
    label: t('minimumToJoinPool'),
    value: parseFloat(planckToUnit(minJoinBond, units)),
    decimals: 3,
    unit: ` ${unit}`,
    helpKey: 'Minimum To Join Pool',
  }
  return <Number {...params} />
}
