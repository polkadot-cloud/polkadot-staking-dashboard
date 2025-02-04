// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const Title = ({ children, style }: ComponentBase) => (
  <h2 className={`${classes.title}`} style={style}>
    {children}
  </h2>
)
