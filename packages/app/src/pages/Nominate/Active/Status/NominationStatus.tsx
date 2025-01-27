// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { useActivePool } from '../../../../contexts/Pools/ActivePool'

export const NominationStatus = () => {
  const { t } = useTranslation('pages')
  const { inPool } = useActivePool()
  const { activeAccount } = useActiveAccounts()
  const { getNominationStatus } = useNominationStatus()

  const nominationStatus = getNominationStatus(activeAccount, 'nominator')
  // Determine whether to display fast unstake button or regular unstake button.

  return (
    <Stat
      label={t('nominate.status')}
      helpKey="Nomination Status"
      stat={inPool() ? t('nominate.alreadyInPool') : nominationStatus.message}
    />
  )
}
