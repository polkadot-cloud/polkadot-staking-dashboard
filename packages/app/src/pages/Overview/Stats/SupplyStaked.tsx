// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Pie } from 'library/StatCards/Pie'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const SupplyStaked = () => {
  const { t } = useTranslation('pages')
  const {
    networkMetrics,
    stakingMetrics: { lastTotalStake },
  } = useApi()
  const { network } = useNetwork()

  const { unit, units } = getNetworkData(network)
  const { totalIssuance } = networkMetrics

  // total supply as percent.
  const totalIssuanceUnit = planckToUnitBn(totalIssuance, units)
  const lastTotalStakeUnit = planckToUnitBn(lastTotalStake, units)
  const supplyAsPercent =
    lastTotalStakeUnit.isZero() || totalIssuanceUnit.isZero()
      ? new BigNumber(0)
      : lastTotalStakeUnit.dividedBy(totalIssuanceUnit.multipliedBy(0.01))

  const params = {
    label: t('unitSupplyStaked', { unit }),
    stat: {
      value: `${supplyAsPercent.decimalPlaces(2).toFormat()}`,
      unit: '%',
    },
    pieValue: supplyAsPercent.decimalPlaces(2).toNumber(),
    tooltip: `${supplyAsPercent.decimalPlaces(2).toFormat()}%`,
    helpKey: 'Supply Staked',
  }

  return <Pie {...params} />
}
