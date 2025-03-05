// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { CSSProperties, ReactNode } from 'react'
import classes from './index.module.scss'

export const Padding = ({
  flex,
  children,
  style,
}: {
  flex?: boolean
  children: ReactNode
  style?: CSSProperties
}) => (
  <div
    className={classes.padding}
    style={{ ...style, display: flex ? 'flex' : 'block' }}
  >
    {children}
  </div>
)
