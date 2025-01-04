// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

/**
 * @name StatBoxRow
 * @summary Used to house a row of `StatBox` items.
 */
export const StatBoxRow = ({ children, style }: ComponentBase) => {
  const divClasses = classNames('page-padding', classes.statBoxRow)

  return (
    <div className={divClasses} style={style}>
      {children}
    </div>
  )
}
