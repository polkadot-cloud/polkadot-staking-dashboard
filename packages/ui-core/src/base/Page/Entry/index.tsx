// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import type { ComponentBase } from 'types'
import classes from './index.module.scss'

export type EntryProps = ComponentBase & {
  mode: 'light' | 'dark'
  theme: string
}

/**
 * @name Entry
 * @summary The outer-most wrapper that hosts core tag styling.
 */
export const Entry = forwardRef(
  (
    { children, style, mode, theme }: EntryProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`${classes.entry} theme-${mode} theme-${theme}`}
      style={style}
    >
      {children}
    </div>
  )
)
