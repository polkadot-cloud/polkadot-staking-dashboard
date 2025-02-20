// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

/**
 * @name Separator
 * @summary A horizontal spacer with a bottom border. General spacer for separating content by row.
 */
export const Separator = ({
  children,
  style,
  transparent,
}: ComponentBase & { transparent?: boolean }) => {
  const allClasses = classNames(classes.separator, {
    [classes.transparent]: transparent,
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
