// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

/**
 * @name Card
 * @summary Used to house a Stat item within a `Stat.Row`.
 */
export const Card = ({ children, style }: ComponentBase) => (
  <div className={classes.card} style={style}>
    {children}
  </div>
)

/**
 * @name Button
 * @summary Used to house a Stat item as a button within a `Stat.Row`.
 */
export const Button = ({ children, style }: ComponentBase) => {
  const allClasses = classNames(classes.card, classes.button)

  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
