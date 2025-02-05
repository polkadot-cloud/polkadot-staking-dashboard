// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IdentityProps } from '../types'
import classes from './index.module.scss'

export const Identity = ({
  Icon,
  Action,
  label,
  value,
  style,
}: IdentityProps) => (
  <div className={classes.identity} style={style}>
    <span>{Icon}</span>
    <div>
      <h3>{label}</h3>
      <h4>
        {value}
        {Action}
      </h4>
    </div>
  </div>
)
