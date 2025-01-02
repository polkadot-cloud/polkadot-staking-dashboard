// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useStaking } from 'contexts/Staking'
import { Pie } from 'library/StatBoxList/Pie'
import { useTranslation } from 'react-i18next'

export const ActiveValidators = () => {
  const { t } = useTranslation('pages')
  const {
    eraStakers: { activeValidators },
  } = useStaking()
  const { validatorCount } = useApi().stakingMetrics

  // active validators as percent. Avoiding dividing by zero.
  let activeValidatorsAsPercent = new BigNumber(0)
  if (validatorCount.isGreaterThan(0)) {
    activeValidatorsAsPercent = new BigNumber(activeValidators).dividedBy(
      validatorCount.multipliedBy(0.01)
    )
  }

  const params = {
    label: t('validators.activeValidators'),
    stat: {
      value: activeValidators,
      total: validatorCount.toNumber(),
      unit: '',
    },
    graph: {
      value1: activeValidators,
      value2: validatorCount.minus(activeValidators).toNumber(),
    },
    tooltip: `${activeValidatorsAsPercent.decimalPlaces(2).toFormat()}%`,
    helpKey: 'Active Validator',
  }

  return <Pie {...params} />
}
