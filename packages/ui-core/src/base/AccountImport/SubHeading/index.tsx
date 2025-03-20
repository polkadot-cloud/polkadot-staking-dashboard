// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const SubHeading = ({
  text,
  style,
}: ComponentBase & {
  text: string
}) => (
  <h4 className={classes.subHeading} style={style}>
    {text}
  </h4>
)
