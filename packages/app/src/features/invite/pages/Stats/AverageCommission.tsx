// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Text } from 'library/StatCards/Text'
import { useTranslation } from 'react-i18next'
import type { Validator } from 'types'

export const AverageCommission = ({
  validators,
  hideHelp,
}: {
  validators: Validator[]
  hideHelp?: boolean
}) => {
  const { t } = useTranslation('invite')

  // Calculate average commission directly from the raw values
  // The raw commission values appear to already be in percentage format
  const avgCommission = validators.length
    ? validators.reduce((acc, v) => {
        // Get the raw commission value, default to 0 if not available
        const commission = v.prefs?.commission ?? 0
        return acc + commission
      }, 0) / validators.length
    : 0

  const params = {
    label: t('averageCommission'),
    value: `${avgCommission.toFixed(2)}%`,
    helpKey: hideHelp ? undefined : 'Average Commission',
  }
  return <Text {...params} />
}
