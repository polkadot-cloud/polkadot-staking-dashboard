// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name StatContent
 * @summary Used to house the title contents within a `StatRow`.
 */
export const StatContent = ({ children, style }: ComponentBase) => (
  <div className={classes.statContent} style={style}>
    {children}
  </div>
)
