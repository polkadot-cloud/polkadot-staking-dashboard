// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import commonClasses from '../common.module.scss'
import type { MultiButtonProps } from '../types'
import classes from './index.module.scss'

export const MultiButton = ({
  children,
  style,
  marginLeft,
  marginRight,
  marginX,
  disabled,
}: MultiButtonProps) => {
  const allClasses = classNames(classes.multiButton, {
    [classes.disabled]: !!disabled,
    [commonClasses.btnSpacingLeft]: marginLeft,
    [commonClasses.btnSpacingRight]: marginRight,
    [commonClasses.btnMarginX]: marginX,
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
