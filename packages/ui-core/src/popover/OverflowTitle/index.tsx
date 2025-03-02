// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { CSSProperties } from 'react'
import classes from './index.module.scss'

export const OverflowTitle = ({
  style,
  text,
}: {
  style?: CSSProperties
  text: string
}) => (
  <div className={classes.overflowTitle} style={style}>
    <h3>{text}</h3>
  </div>
)
