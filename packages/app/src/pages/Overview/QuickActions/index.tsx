// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { QuickAction } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { Disconnected } from './Disconnected'
import { NotStaking } from './NotStaking'
import { Staking } from './Staking'
import type { QuickActionGroup } from './types'

export const QuickActions = ({ height }: { height: number }) => {
  const { t } = useTranslation('pages')
  const { inPool } = useActivePool()
  const { isNominator } = useStaking()
  const { accountSynced } = useSyncing()
  const { activeAddress } = useActiveAccounts()

  const isStaking = inPool || isNominator
  const syncing = !accountSynced(activeAddress)

  let actionGroup: QuickActionGroup = 'staking'
  if (!activeAddress) {
    actionGroup = 'disconnected'
  } else if (!isStaking) {
    actionGroup = 'notStaking'
  }

  return (
    <CardWrapper style={{ padding: 0 }} height={height}>
      <CardHeader style={{ padding: '1.25rem 1rem 0.5rem 1.25rem' }}>
        <h4>{t('quickActions')}</h4>
      </CardHeader>
      {syncing ? (
        <QuickAction.Container>
          <QuickAction.PreloadingButton />
        </QuickAction.Container>
      ) : (
        <>
          {actionGroup === 'disconnected' && <Disconnected />}
          {actionGroup === 'notStaking' && <NotStaking />}
          {actionGroup === 'staking' && (
            <Staking bondFor={inPool ? 'pool' : 'nominator'} />
          )}
        </>
      )}
    </CardWrapper>
  )
}
