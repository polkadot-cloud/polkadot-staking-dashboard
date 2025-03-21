// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react'
import { Account } from './Account'
import { Settings } from './Settings'
import { SideMenuToggle } from './SideMenuToggle'
import { Sync } from './Sync'
import { Wrapper } from './Wrappers'

export const Headers = () => {
  const [openConnect, setOpenConnect] = useState<boolean>(false)

  return (
    <Wrapper>
      <SideMenuToggle />
      <Sync />
      <Account openConnect={openConnect} setOpenConnect={setOpenConnect} />
      <Settings openConnect={openConnect} setOpenConnect={setOpenConnect} />
    </Wrapper>
  )
}
