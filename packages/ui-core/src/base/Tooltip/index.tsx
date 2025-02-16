// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Tooltip as RadixTooltip } from 'radix-ui'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import classes from './index.module.scss'

export const Tooltip = ({
  children,
  container,
  text,
  onTriggerClick,
  onPointerDownOutside,
}: {
  children: ReactNode
  container?: HTMLDivElement
  text: string
  onTriggerClick?: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  onPointerDownOutside?: (e: Event) => void
}) => (
  <RadixTooltip.Root>
    <RadixTooltip.Trigger
      asChild
      onClick={(event) => {
        if (typeof onTriggerClick === 'function') {
          onTriggerClick(event)
        }
        event.preventDefault()
      }}
    >
      {children}
    </RadixTooltip.Trigger>
    <RadixTooltip.Portal container={container}>
      <RadixTooltip.Content
        className={classes.Content}
        sideOffset={5}
        onPointerDownOutside={(event) => {
          if (typeof onPointerDownOutside === 'function') {
            onPointerDownOutside(event)
          }
          event.preventDefault()
        }}
      >
        {text}
        <RadixTooltip.Arrow className={classes.Arrow} />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  </RadixTooltip.Root>
)
