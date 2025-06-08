// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useAverageRewardRate } from 'hooks/useAvgRewardRate'
import { Text } from 'library/StatCards/Text'
import { useTranslation } from 'react-i18next'

export const AverageRewardRate = () => {
  const { t } = useTranslation('pages')
  const { getAverageRewardRate } = useAverageRewardRate()

  const params = {
    label: `${t('averageRewardRate')}`,
    value: `${new BigNumber(getAverageRewardRate()).decimalPlaces(2).toFormat()}%`,
    helpKey: 'Average Reward Rate',

    primary: true,
  }

  return <Text {...params} />
}
