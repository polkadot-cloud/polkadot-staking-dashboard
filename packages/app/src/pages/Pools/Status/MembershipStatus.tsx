// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { determinePoolDisplay } from 'contexts/Pools/util'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import type { MembershipStatusProps } from './types'
import { useStatusButtons } from './useStatusButtons'

export const MembershipStatus = ({
  showButtons = true,
  buttonType = 'primary',
}: MembershipStatusProps) => {
  const { t } = useTranslation('pages')
  const { isReady } = useApi()
  const { inSetup } = useStaking()
  const { label } = useStatusButtons()
  const { openModal } = useOverlay().modal
  const { poolsMetaData } = useBondedPools()
  const { activeAccount } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { activePool, isOwner, isBouncer, isMember } = useActivePool()

  const { active } = getTransferOptions(activeAccount).pool
  const poolState = activePool?.bondedPool?.state ?? null

  const membershipButtons = []
  let membershipDisplay = t('pools.notInPool')

  if (activePool) {
    // Determine pool membership display.
    membershipDisplay = determinePoolDisplay(
      activePool.addresses.stash,
      poolsMetaData[Number(activePool.id)]
    )

    // Display manage button if active account is pool owner or bouncer.
    // Or display manage button if active account is a pool member.
    if (
      (poolState !== 'Destroying' && (isOwner() || isBouncer())) ||
      (isMember() && active?.isGreaterThan(0))
    ) {
      // Display manage button if active account is not a read-only account.
      if (!isReadOnlyAccount(activeAccount)) {
        membershipButtons.push({
          title: t('pools.manage'),
          icon: faCog,
          disabled: !isReady,
          small: true,
          onClick: () =>
            openModal({
              key: 'ManagePool',
              options: { disableWindowResize: true, disableScroll: true },
              size: 'sm',
            }),
        })
      }
    }
  }

  return activePool ? (
    <Stat
      label={label}
      helpKey="Pool Membership"
      type="address"
      stat={{
        address: activePool?.addresses?.stash ?? '',
        display: membershipDisplay,
      }}
      buttons={showButtons ? membershipButtons : []}
    />
  ) : (
    <Stat
      label={t('pools.poolMembership')}
      helpKey="Pool Membership"
      stat={!inSetup() ? t('pools.alreadyNominating') : t('pools.notInPool')}
      buttonType={buttonType}
    />
  )
}
