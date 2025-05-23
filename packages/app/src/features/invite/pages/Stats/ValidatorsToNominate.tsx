// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'

export const ValidatorsToNominate = ({ count }: { count: number }) => {
  const { t } = useTranslation('invite')

  const params = {
    label: t('validatorsToNominate', { count: 0 }).replace('0', ''),
    value: count,
    unit: '',
    helpKey: 'Validators To Nominate',
  }
  return <Number {...params} />
}
