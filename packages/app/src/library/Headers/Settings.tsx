// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { InactiveButtonHeader } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { MenuPopover } from './Popovers/MenuPopover'

export const Settings = () => {
  const { themeElementRef } = useTheme()

  const [open, setOpen] = useState<boolean>(false)

  return (
    <Popover
      open={open}
      portalContainer={themeElementRef.current || undefined}
      content={<MenuPopover setOpen={setOpen} />}
      onTriggerClick={() => {
        setOpen(!open)
      }}
    >
      <InactiveButtonHeader marginLeft icon={faCog} />
    </Popover>
  )
}
