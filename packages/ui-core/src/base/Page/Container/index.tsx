// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import { MaxPageWidth } from 'consts'
import classes from './index.module.scss'

/**
 * @name Container
 * @summary Page container.
 */
export const Container = ({ children, style }: ComponentBase) => (
  <div
    className={classes.container}
    style={{ ...style, maxWidth: `${MaxPageWidth}px` }}
  >
    {children}
  </div>
)
