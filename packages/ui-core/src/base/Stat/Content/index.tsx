// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'
import classes from './index.module.scss'

/**
 * @name Content
 * @summary Used to house the title contents within a `StatRow`.
 */
export const Content = ({ children, style }: ComponentBase) => (
  <div className={classes.content} style={style}>
    {children}
  </div>
)
