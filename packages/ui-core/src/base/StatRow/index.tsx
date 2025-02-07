// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

/**
 * @name StatRow
 * @summary Used to house a row of `StatBox` items.
 */
export const StatRow = ({ children, style }: ComponentBase) => {
  const allClasses = classNames('page-padding', classes.statRow)

  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
