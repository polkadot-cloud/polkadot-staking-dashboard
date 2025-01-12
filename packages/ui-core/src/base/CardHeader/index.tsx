// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

export const CardHeader = ({
  children,
  style,
  action,
  margin,
}: ComponentBase & { action?: boolean; margin?: boolean }) => {
  const allClasses = classNames(classes.cardHeader, {
    [classes.action]: !!action,
    [classes.margin]: !!margin,
  })

  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
