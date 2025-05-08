// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { useInviteNotification } from 'contexts/InviteNotification'
import { useRef, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { Padding } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'

export const InvitePopover = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { openCanvas } = useOverlay().canvas
  const { inviteData, dismissInvite, inviteType } = useInviteNotification()
  // NOTE: We assume a valid pool invite is active
  const poolId = Number(inviteData.poolId)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-invite'])

  // TODO: Enhance styling and support validator invites

  return (
    <div ref={popoverRef} style={{ paddingTop: '1.5rem' }}>
      <Padding>
        <h4>1 Notification</h4>
        <h3 style={{ margin: '0.75rem 0 1.5rem 0' }}>
          {inviteType === 'pool'
            ? t('youHaveBeenInvitedToJoinPool', { ns: 'invite' })
            : t('youHaveBeenInvitedToNominate', { ns: 'invite' })}
          !
        </h3>
      </Padding>
      <PopoverTab.Container position="bottom" yMargin>
        <PopoverTab.Button
          text={t('viewInvite', { ns: 'invite' })}
          onClick={() => {
            setOpen(false)
            openCanvas({
              key: 'Pool',
              options: {
                providedPool: {
                  id: poolId,
                },
              },
              size: 'xl',
            })
          }}
        />
        <PopoverTab.Button
          status="danger"
          text={t('dismiss', { ns: 'invite' })}
          onClick={() => {
            dismissInvite()
            setOpen(false)
          }}
        />
      </PopoverTab.Container>
    </div>
  )
}
