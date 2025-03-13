// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import classes from './index.module.scss'

export const Heading = ({
  text,
  children,
}: {
  text: string
  children: ReactNode
}) => (
  <div className={classes.heading}>
    <h4>{text}</h4>
    <div>{children}</div>
  </div>
)
