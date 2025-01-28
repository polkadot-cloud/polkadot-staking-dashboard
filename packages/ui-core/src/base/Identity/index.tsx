// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IdentityProps } from '../types'
import classes from './index.module.scss'

export const Identity = ({
  Icon,
  Action,
  label,
  subheading,
  style,
}: IdentityProps) => (
  <div className={classes.identity} style={style}>
    <span className="icon">{Icon}</span>
    <div>
      <h3>{label}</h3>
      <h4>
        {subheading}
        {Action}
      </h4>
    </div>
  </div>
)
