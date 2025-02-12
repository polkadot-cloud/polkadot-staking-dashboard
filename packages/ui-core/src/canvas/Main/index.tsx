// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const Main = ({ children, style }: ComponentBase) => (
  <div className={classes.main} style={style}>
    {children}
  </div>
)
