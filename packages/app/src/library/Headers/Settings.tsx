// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog, faPlugCircleBolt } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from 'contexts/Themes'
import { ConnectOverlay } from 'library/ConnectOverlay'
import { useState } from 'react'
import { InactiveButtonHeader } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { MenuPopover } from './Popovers/MenuPopover'

export const Settings = () => {
  const { themeElementRef } = useTheme()

  const [openSettings, setOpenSettings] = useState<boolean>(false)
  const [openConnect, setOpenConnect] = useState<boolean>(false)

  return (
    <>
      <Popover
        open={openConnect}
        portalContainer={themeElementRef.current || undefined}
        content={<ConnectOverlay setOpen={setOpenConnect} />}
        onTriggerClick={() => {
          setOpenConnect(!openConnect)
        }}
      >
        <InactiveButtonHeader
          className="header-connect"
          marginLeft
          icon={faPlugCircleBolt}
        />
      </Popover>
      <Popover
        open={openSettings}
        portalContainer={themeElementRef.current || undefined}
        content={<MenuPopover setOpen={setOpenSettings} />}
        onTriggerClick={() => {
          setOpenSettings(!openSettings)
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
