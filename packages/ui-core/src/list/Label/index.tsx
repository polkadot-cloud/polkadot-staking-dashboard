// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'
import classes from './index.module.scss'

export const Label = ({ children, style }: ComponentBase) => (
  <div className={classes.label} style={style}>
    {children}
  </div>
)
