// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import { MaxPageWidth } from 'consts'
import classes from './index.module.scss'

/**
 * @name Page
 * @summary Page container.
 */
export const Page = ({ children, style }: ComponentBase) => (
  <div
    className={classes.page}
    style={{ ...style, maxWidth: `${MaxPageWidth}px` }}
  >
    {children}
  </div>
)
