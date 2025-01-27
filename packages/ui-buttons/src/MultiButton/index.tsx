// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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
}: MultiButtonProps) => {
  const allClasses = classNames(classes.multiButton, {
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
