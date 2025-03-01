// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useSyncing } from 'hooks/useSyncing'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'

export const RewardsStatus = ({ dimmed }: { dimmed: boolean }) => {
  const { t } = useTranslation('pages')
  const {
    networkData: { units },
  } = useNetwork()
  const { isReady } = useApi()
  const { activePool } = useActivePool()
  const { openModal } = useOverlay().modal
  const { activeAccount } = useActiveAccounts()
  const { syncing } = useSyncing(['active-pools'])
  const { isReadOnlyAccount } = useImportedAccounts()

  const pendingRewards = activePool?.pendingRewards || 0n
  const minUnclaimedDisplay = 1000000n

  const labelRewards =
    pendingRewards > minUnclaimedDisplay
      ? planckToUnit(pendingRewards, units).toString()
      : '0'

  // Display Reward buttons if unclaimed rewards is a non-zero value.
  const buttonsRewards = isReadOnlyAccount(activeAccount)
    ? []
    : pendingRewards > minUnclaimedDisplay
      ? [
          {
            title: t('withdraw'),
            icon: faCircleDown,
            disabled: !isReady,
            small: true,
            onClick: () =>
              openModal({
                key: 'ClaimReward',
                options: { claimType: 'withdraw' },
                size: 'sm',
              }),
          },
          {
            title: t('compound'),
            icon: faPlus,
            disabled:
              !isReady || activePool?.bondedPool?.state === 'Destroying',
            small: true,
            onClick: () =>
              openModal({
                key: 'ClaimReward',
                options: { claimType: 'bond' },
                size: 'sm',
              }),
          },
        ]
      : undefined

  return (
    <Stat
      label={t('unclaimedRewards')}
      helpKey="Pool Rewards"
      type="odometer"
      stat={{ value: labelRewards }}
      dimmed={dimmed}
      buttons={syncing ? [] : buttonsRewards}
    />
  )
}
