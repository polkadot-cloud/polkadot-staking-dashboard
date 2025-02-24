// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import commonClasses from '../common.module.scss'
import classes from './index.module.scss'

export const Row = ({ children, style }: ComponentBase) => {
  const allClasses = classNames(commonClasses.row, classes.body)

  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
