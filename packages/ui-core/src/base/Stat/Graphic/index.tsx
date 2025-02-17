// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name Graphic
 * @summary Used to house a graphic in a `StatCard`
 */
export const Graphic = ({ children, style }: ComponentBase) => (
  <div className={classes.graphic} style={style}>
    {children}
  </div>
)
