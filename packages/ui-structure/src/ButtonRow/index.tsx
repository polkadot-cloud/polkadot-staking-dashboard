// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { RowProps } from '../types'
import classes from './index.module.scss'

/**
 * @name ButtonRow
 * @summary A flex container for a row of buttons.
 */
export const ButtonRow = ({ children, style, yMargin }: RowProps) => {
  const buttonClasses = classNames(classes.buttonRow, {
    [classes.buttonRowYMargin]: yMargin,
  })

  return (
    <div className={buttonClasses} style={style}>
      {children}
    </div>
  )
}
