// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name Card
 * @summary Used to house a Stat item within a `StatRow`.
 */
export const Card = ({ children, style }: ComponentBase) => (
  <div className={classes.card} style={style}>
    {children}
  </div>
)
