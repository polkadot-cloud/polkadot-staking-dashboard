// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'

export const SelectedValidators = ({
  count,
  hideHelp,
}: {
  count: number
  hideHelp?: boolean
}) => {
  const { t } = useTranslation('invite')

  const params = {
    label: t('selectedValidators'),
    value: count,
    unit: '',
    helpKey: hideHelp ? undefined : 'Selected Validators',
  }
  return <Number {...params} />
}
