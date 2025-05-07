// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useInviteNotification } from 'contexts/InviteNotification'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { InactiveButtonHeader } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { InvitePopover } from './Popovers/InvitePopover'

export const Invite = () => {
  const { themeElementRef } = useTheme()
  const { inviteActive } = useInviteNotification()
  const [open, setOpen] = useState<boolean>(false)

  // Don't render if no active invite
  if (!inviteActive) {
    return null
  }

  return (
    <Popover
      open={open}
      portalContainer={themeElementRef.current || undefined}
      content={<InvitePopover setOpen={setOpen} />}
      onTriggerClick={() => {
        setOpen(!open)
      }}
      width="350px"
    >
      <InactiveButtonHeader
        className="header-invite"
        icon={faBell}
        marginLeft
        active
      />
    </Popover>
  )
}
