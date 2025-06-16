// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { Pie } from 'library/StatCards/Pie'
import { useTranslation } from 'react-i18next'
import { percentageOf } from 'ui-graphs/util'

export const TotalValidators = () => {
  const { t } = useTranslation('pages')
  const {
    stakingMetrics: { counterForValidators, maxValidatorsCount },
  } = useApi()

  // total validators as percent
  let totalValidatorsAsPercent = 0
  if (maxValidatorsCount && maxValidatorsCount > 0) {
    totalValidatorsAsPercent = counterForValidators / (maxValidatorsCount / 100)
  }

  const params = {
    label: t('totalValidators'),
    stat: {
      value: counterForValidators,
      total: maxValidatorsCount,
      unit: '',
    },
    pieValue: maxValidatorsCount
      ? percentageOf(counterForValidators, maxValidatorsCount)
      : 0,
    tooltip: `${new BigNumber(totalValidatorsAsPercent)
      .decimalPlaces(2)
      .toFormat()}%`,
    helpKey: 'Validator',
  }
  return <Pie {...params} />
}
