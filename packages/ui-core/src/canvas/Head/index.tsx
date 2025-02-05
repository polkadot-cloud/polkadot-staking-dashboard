// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const Head = ({ children, style }: ComponentBase) => (
  <div className={classes.head} style={style}>
    {children}
  </div>
)
