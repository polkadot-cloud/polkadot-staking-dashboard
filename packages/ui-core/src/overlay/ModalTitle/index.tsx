// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const ModalTitle = ({ children, style }: ComponentBase) => (
  <h2 className={`${classes.modalTitle}`} style={style}>
    {children}
  </h2>
)
