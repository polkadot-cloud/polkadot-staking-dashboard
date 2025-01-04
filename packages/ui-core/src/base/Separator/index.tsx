// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name Separator
 * @summary A horizontal spacer with a bottom border. General spacer for separating content by row.
 */
export const Separator = ({ children, style }: ComponentBase) => (
  <div className={classes.separator} style={style}>
    {children}
  </div>
)
