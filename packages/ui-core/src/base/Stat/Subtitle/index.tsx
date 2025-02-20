// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

/**
 * @name Subtitle
 * @summary Used to house a subtitle for `StatCard`
 */
export const Subtitle = ({
  children,
  style,
  primary,
}: ComponentBase & {
  primary?: boolean
}) => {
  const allClasses = classNames(classes.subtitle, {
    [classes.primary]: !!primary,
  })

  return (
    <h4 className={allClasses} style={style}>
      {children}
    </h4>
  )
}
