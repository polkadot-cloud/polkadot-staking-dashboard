// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog, faPlugCircleBolt } from '@fortawesome/free-solid-svg-icons'
import { useConnectNew } from 'contexts/ConnectNew'
import type { ConnectMouseEvent } from 'contexts/ConnectNew/types'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { ButtonHeader, InactiveButtonHeader } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { MenuPopover } from './Popovers/MenuPopover'

export const Settings = () => {
  const { themeElementRef } = useTheme()
  const { openConnectOverlay } = useConnectNew()

  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <ButtonHeader
        className="header-settings"
        marginLeft
        icon={faPlugCircleBolt}
        onClick={(ev: ConnectMouseEvent) => {
          openConnectOverlay(ev)
        }}
      />
      <Popover
        open={open}
        portalContainer={themeElementRef.current || undefined}
        content={<MenuPopover setOpen={setOpen} />}
        onTriggerClick={() => {
          setOpen(!open)
        }}
      >
        <InactiveButtonHeader
          className="header-settings"
          marginLeft
          icon={faCog}
        />
      </Popover>
    </>
  )
}
