// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name Page
 * @summary Page heading container.
 */
export const PageHeading = ({ children, style }: ComponentBase) => (
  <div className={classes.pageHeading} style={style}>
    {children}
  </div>
)
