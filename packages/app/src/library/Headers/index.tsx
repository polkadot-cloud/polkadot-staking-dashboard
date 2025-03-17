// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlug } from '@fortawesome/free-solid-svg-icons'
import { ButtonHeader } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { Account } from './Account'
import { Settings } from './Settings'
import { SideMenuToggle } from './SideMenuToggle'
import { Sync } from './Sync'
import { Wrapper } from './Wrappers'

export const Headers = () => {
  const { openModal } = useOverlay().modal

  return (
    <Wrapper>
      <SideMenuToggle />
      <Sync />
      <Account />
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
