// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlug } from '@fortawesome/free-solid-svg-icons'
import { ButtonHeader } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { Connected } from './Connected'
import { Settings } from './Settings'
import { SideMenuToggle } from './SideMenuToggle'
import { Sync } from './Sync'
import { Wrapper } from './Wrappers'

export const Headers = () => {
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

      <Settings />
    </Wrapper>
  )
}
