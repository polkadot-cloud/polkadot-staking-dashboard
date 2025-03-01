// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { Text } from 'library/StatCards/Text'
import { useTranslation } from 'react-i18next'

export const AverageRewardRate = () => {
  const { t } = useTranslation('pages')
  const { getAverageRewardRate } = useAverageRewardRate()
  // Get the compounded Average Reward Rate.
  const { avgRateBeforeCommission } = getAverageRewardRate(false)

  const params = {
    label: `${t('averageRewardRate')}`,
    value: `${avgRateBeforeCommission.decimalPlaces(2).toFormat()}%`,
    helpKey: 'Average Reward Rate',

    primary: true,
  }

  return <Text {...params} />
}
