// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const Empty = ({ style, children }: ComponentBase) => (
  <div className={classes.empty} style={style}>
    {children}
  </div>
)
