// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { LabelRowProps } from '../types'
import classes from './index.module.scss'

export const LabelRow = ({ children, style, inline }: LabelRowProps) => {
  const allClasses = classNames(classes.labelRow, {
    [classes.inline]: !!inline,
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}