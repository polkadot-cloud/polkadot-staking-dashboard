// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name StatSubtitle
 * @summary Used to house a subtitle for `StatCard`
 */
export const StatSubtitle = ({ children, style }: ComponentBase) => (
  <h4 className={classes.statSubtitle} style={style}>
    {children}
  </h4>
)
