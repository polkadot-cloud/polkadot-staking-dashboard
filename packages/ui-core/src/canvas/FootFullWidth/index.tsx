// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'
import classes from './index.module.scss'

export const FootFullWidth = ({ children, style }: ComponentBase) => (
  <div className={classes.footFullWidth} style={style}>
    {children}
  </div>
)
