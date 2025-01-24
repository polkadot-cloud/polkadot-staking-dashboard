// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { GraphProps } from '../types'
import classes from './index.module.scss'

export const Graph = ({ children, style, syncing, canvas }: GraphProps) => {
  const allClasses = classNames(classes.graph, {
    [classes.canvas]: !!canvas,
  })
  return (
    <div className={allClasses} style={style}>
      {syncing && <div className={classes.preload} />}
      {children}
    </div>
  )
}
