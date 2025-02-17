// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

/**
 * @name StatTitle
 * @summary Used to house a title for `StatCard`
 */
export const StatTitle = ({
  children,
  style,
  primary,
  text,
}: ComponentBase & {
  primary?: boolean
  text?: boolean
}) => {
  const allClasses = classNames(classes.statTitle, {
    [classes.primary]: !!primary,
    [classes.text]: !!text,
  })

  return (
    <h3 className={allClasses} style={style}>
      {children}
    </h3>
  )
}
