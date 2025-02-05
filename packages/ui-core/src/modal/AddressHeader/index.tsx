// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const AddressHeader = ({ children, style }: ComponentBase) => (
  <div className={classes.addressHeader} style={style}>
    {children}
  </div>
)
