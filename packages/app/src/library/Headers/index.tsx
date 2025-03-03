// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog, faPlug } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from 'contexts/Themes'
import { ButtonHeader, InactiveButtonHeader } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import { Connected } from './Connected'
import { MenuPopover } from './Popovers/MenuPopover'
import { SideMenuToggle } from './SideMenuToggle'
import { Sync } from './Sync'
import { Wrapper } from './Wrappers'

export const Headers = () => {
  const { themeElementRef } = useTheme()
  const { openModal } = useOverlay().modal

  return (
    <Wrapper>
      {/* Side menu toggle */}
      <SideMenuToggle />

      {/* Syncing spinner */}
      <Sync />

      {/* Account with Popover */}
      <Connected />

      {/* Connect */}
      <ButtonHeader
        marginLeft
        icon={faPlug}
        onClick={() => {
          openModal({ key: 'Connect' })
        }}
      />

      {/* Settings */}
      <Popover
        portalContainer={themeElementRef.current || undefined}
        content={<MenuPopover />}
      >
        <InactiveButtonHeader marginLeft icon={faCog} />
      </Popover>
    </Wrapper>
  )
}
