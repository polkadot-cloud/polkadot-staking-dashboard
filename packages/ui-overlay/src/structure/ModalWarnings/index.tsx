// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const ModalWarnings = ({ children, style }: ComponentBase) => (
  <div className={classes.modalWarnings} style={style}>
    {children}
  </div>
)
