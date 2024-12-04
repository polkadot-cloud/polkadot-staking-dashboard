// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useStaking } from 'contexts/Staking'
import { Pie } from 'library/StatBoxList/Pie'
import { useTranslation } from 'react-i18next'

export const ActiveNominatorsStat = () => {
  const { t } = useTranslation('pages')
  const {
    stakingMetrics: { counterForNominators },
  } = useApi()
  const { totalActiveNominators } = useStaking().eraStakers

  // active nominators as percent
  let totalNominatorsAsPercent = 0
  if (counterForNominators.isGreaterThan(0)) {
    totalNominatorsAsPercent =
      totalActiveNominators / counterForNominators.dividedBy(100).toNumber()
  }

  const params = {
    label: t('overview.activeNominators'),
    stat: {
      value: totalActiveNominators,
      total: counterForNominators.toNumber(),
      unit: '',
    },
    graph: {
      value1: totalActiveNominators,
      value2: counterForNominators.minus(totalActiveNominators).toNumber(),
    },
    tooltip: `${new BigNumber(totalNominatorsAsPercent)
      .decimalPlaces(2)
      .toFormat()}%`,
    helpKey: 'Active Nominators',
  }

  return <Pie {...params} />
}
