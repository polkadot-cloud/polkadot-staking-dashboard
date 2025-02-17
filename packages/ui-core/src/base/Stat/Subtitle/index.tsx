// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name Subtitle
 * @summary Used to house a subtitle for `StatCard`
 */
export const Subtitle = ({ children, style }: ComponentBase) => (
  <h4 className={classes.subtitle} style={style}>
    {children}
  </h4>
)
