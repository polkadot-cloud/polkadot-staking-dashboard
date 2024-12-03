// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import classes from './index.module.scss'

/**
 * @name Main
 * @summary A column flex wrapper that hosts the main page content.
 */
export const Main = forwardRef(
  ({ children, style }: ComponentBase, ref?: ForwardedRef<HTMLDivElement>) => (
    <div className={classes.main} ref={ref} style={style}>
      {children}
    </div>
  )
)
Main.displayName = 'Main'
