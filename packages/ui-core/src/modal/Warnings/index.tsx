// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'
import classes from './index.module.scss'

export const Warnings = ({ children, style }: ComponentBase) => (
  <div className={classes.warnings} style={style}>
    {children}
  </div>
)
