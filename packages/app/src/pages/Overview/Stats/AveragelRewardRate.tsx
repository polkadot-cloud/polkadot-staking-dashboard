// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { Text } from 'library/StatBoxList/Text'
import { useTranslation } from 'react-i18next'

export const AverageRewardRate = () => {
  const { t } = useTranslation('pages')
  const { getAverageRewardRate } = useAverageRewardRate()
  // Get the compounded Average Reward Rate.
  const { avgRateBeforeCommission, avgRateAfterCommission } =
    getAverageRewardRate(false)

  const params = {
    label: `${t('overview.averageRewardRate')}`,
    value: `${avgRateBeforeCommission.decimalPlaces(2).toFormat()}%`,
    secondaryValue: `${avgRateAfterCommission.decimalPlaces(2).toFormat()}% ${t(
      'overview.afterCommission'
    )}`,
    helpKey: 'Average Reward Rate',

    primary: true,
  }

  return <Text {...params} />
}
