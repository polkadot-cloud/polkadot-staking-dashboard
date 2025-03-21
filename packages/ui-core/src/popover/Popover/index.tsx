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
  onTriggerClick,
  width,
}: {
  children: ReactNode
  content: ReactNode
  portalContainer?: HTMLDivElement
  open?: boolean
  onTriggerClick?: () => void
  width?: string | number
}) => {
  width = width || '310px'

  return (
    <RadixPopover.Root open={open}>
      <RadixPopover.Trigger
        onClick={() => {
          if (typeof onTriggerClick === 'function') {
            onTriggerClick()
          }
        }}
      >
        {children}
      </RadixPopover.Trigger>
      <RadixPopover.Portal container={portalContainer}>
        <RadixPopover.Content
          className={classes.Content}
          sideOffset={4}
          collisionPadding={15}
          onOpenAutoFocus={(event) => event.preventDefault()}
          style={{ width }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {content}
          </div>
          <RadixPopover.Arrow className={classes.Arrow} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
