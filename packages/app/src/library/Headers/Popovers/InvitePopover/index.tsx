// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { useInvites } from 'contexts/Invites'
import type { PoolInvite } from 'contexts/Invites/types'
import { useRef, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { Padding } from 'ui-core/popover'
import { Pool } from './Pool'

export const InvitePopover = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation('app')
  const { inviteConfig, dismissInvite } = useInvites()

  // NOTE: We assume a valid pool invite is active
  const popoverRef = useRef<HTMLDivElement>(null)

  // Determine if a pool invite is active
  let poolId: number | undefined
  if (inviteConfig?.type === 'pool') {
    poolId = (inviteConfig.invite as PoolInvite).poolId
  }

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-invite'])

  return (
    <div ref={popoverRef} style={{ paddingTop: '1.5rem' }}>
      <Padding>
        <h4>1 {t('notification', { count: 1 })}</h4>
        <h3 style={{ margin: '0.75rem 0 1.5rem 0' }}>
          {inviteConfig && inviteConfig.type === 'pool'
            ? t('invitePool')
            : t('inviteNominate')}
          !
        </h3>
      </Padding>
      <PopoverTab.Container position="bottom" yMargin>
        {poolId && <Pool poolId={poolId} setOpen={setOpen} />}
        <PopoverTab.Button
          status="danger"
          text={t('dismiss')}
          onClick={() => {
            dismissInvite()
            setOpen(false)
          }}
        />
      </PopoverTab.Container>
    </div>
  )
}
