// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useStaking } from 'contexts/Staking'
import { Pie } from 'library/StatCards/Pie'
import { useTranslation } from 'react-i18next'
import { percentageOf } from 'ui-graphs'

export const ActiveNominators = () => {
  const { t } = useTranslation('pages')
  const {
    stakingMetrics: { counterForNominators },
  } = useApi()
  const { totalActiveNominators } = useStaking().eraStakers

  // active nominators as percent
  let totalNominatorsAsPercent = 0
  if (counterForNominators > 0) {
    totalNominatorsAsPercent = percentageOf(
      totalActiveNominators,
      counterForNominators
    )
  }

  const params = {
    label: t('activeNominators'),
    stat: {
      value: totalActiveNominators,
      total: counterForNominators,
      unit: '',
    },
    pieValue: totalNominatorsAsPercent,
    tooltip: `${new BigNumber(totalNominatorsAsPercent)
      .decimalPlaces(2)
      .toFormat()}%`,
    helpKey: 'Active Nominators',
  }

  return <Pie {...params} />
}
