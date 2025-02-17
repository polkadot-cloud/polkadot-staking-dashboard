// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

export const Head = ({ children, style }: ComponentBase) => {
  const allClasses = classNames(classes.row, classes.head)

  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
