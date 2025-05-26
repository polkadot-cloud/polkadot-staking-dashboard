// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { useActivePool } from '../../../../contexts/Pools/ActivePool'

export const NominationStatus = () => {
  const { t } = useTranslation('pages')
  const { inPool } = useActivePool()
  const { activeAddress } = useActiveAccounts()
  const { getNominationStatus } = useNominationStatus()

  const nominationStatus = getNominationStatus(activeAddress, 'nominator')
  // Determine whether to display fast unstake button or regular unstake button.

  return (
    <Stat
      label={t('status')}
      helpKey="Nomination Status"
      stat={inPool ? t('alreadyInPool') : nominationStatus.message}
    />
  )
}
