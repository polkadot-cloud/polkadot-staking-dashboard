// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'contexts/Validators/types'
import { Text } from 'library/StatCards/Text'
import { useTranslation } from 'react-i18next'

export const AverageCommission = ({
  validators,
}: {
  validators: Validator[]
}) => {
  const { t } = useTranslation('invite')

  // Calculate average commission
  const avgCommission = validators.length
    ? validators.reduce((acc, v) => {
        const commission = v.prefs?.commission
          ? v.prefs.commission / 10000000
          : 0
        return acc + commission
      }, 0) / validators.length
    : 0

  const params = {
    label: t('averageCommission'),
    value: `${avgCommission.toFixed(2)}%`,
    helpKey: 'Average Commission',
  }
  return <Text {...params} />
}
