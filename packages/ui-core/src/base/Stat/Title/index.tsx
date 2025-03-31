// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ComponentBase } from 'types'
import classes from './index.module.scss'

/**
 * @name Title
 * @summary Used to house a title for `Stat.Card`
 */
export const Title = ({
  children,
  style,
  primary,
  text,
  semibold,
}: ComponentBase & {
  primary?: boolean
  text?: boolean
  semibold?: boolean
}) => {
  const allClasses = classNames(classes.title, {
    [classes.semibold]: !!semibold,
    [classes.primary]: !!primary,
    [classes.text]: !!text,
  })

  return (
    <h3 className={allClasses} style={style}>
      {children}
    </h3>
  )
}
