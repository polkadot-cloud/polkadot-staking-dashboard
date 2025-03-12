// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
