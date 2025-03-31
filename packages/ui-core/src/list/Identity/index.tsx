// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'
import classes from './index.module.scss'

export const Identity = ({ children, style }: ComponentBase) => (
  <div className={classes.identity} style={style}>
    {children}
  </div>
)
