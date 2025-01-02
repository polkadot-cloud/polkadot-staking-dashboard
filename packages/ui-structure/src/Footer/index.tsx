// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

/**
 * @name Footer
 * @summary Footer container.
 */
export const Footer = ({ children, style }: ComponentBase) => (
  <div className={classes.footer} style={style}>
    {children}
  </div>
)
