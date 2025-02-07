// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { Pie } from 'library/StatCards/Pie'
import { useTranslation } from 'react-i18next'
import { percentageOf } from 'ui-graphs'

export const TotalValidators = () => {
  const { t } = useTranslation('pages')
  const {
    stakingMetrics: { totalValidators, maxValidatorsCount },
  } = useApi()

  // total validators as percent
  let totalValidatorsAsPercent = 0
  if (maxValidatorsCount.isGreaterThan(0)) {
    totalValidatorsAsPercent = totalValidators
      .div(maxValidatorsCount.dividedBy(100))
      .toNumber()
  }

  const params = {
    label: t('validators.totalValidators'),
    stat: {
      value: totalValidators.toNumber(),
      total: maxValidatorsCount.toNumber(),
      unit: '',
    },
    pieValue: percentageOf(
      totalValidators.toNumber(),
      maxValidatorsCount.toNumber()
    ),
    tooltip: `${new BigNumber(totalValidatorsAsPercent)
      .decimalPlaces(2)
      .toFormat()}%`,
    helpKey: 'Validator',
  }
  return <Pie {...params} />
}
