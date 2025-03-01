// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Popover as RadixPopover } from 'radix-ui'
import type { ReactNode } from 'react'
import classes from './index.module.scss'

export const Popover = ({
  children,
  content,
  portalContainer,
  open,
}: {
  children: ReactNode
  content: ReactNode
  portalContainer?: HTMLDivElement
  open?: boolean
}) => (
  <RadixPopover.Root open={open}>
    <RadixPopover.Trigger>{children}</RadixPopover.Trigger>
    <RadixPopover.Portal container={portalContainer}>
      <RadixPopover.Content
        className={classes.Content}
        sideOffset={5}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {content}
        </div>
        <RadixPopover.Arrow className={classes.Arrow} />
      </RadixPopover.Content>
    </RadixPopover.Portal>
  </RadixPopover.Root>
)
