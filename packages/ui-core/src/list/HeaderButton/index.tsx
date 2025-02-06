// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { HeaderButtonProps } from '../types'
import classes from './index.module.scss'

export const HeaderButton = ({
  children,
  style,
  outline,
  withText,
}: HeaderButtonProps) => {
  const allClasses = classNames(classes.headerButton, {
    [classes.text]: !!withText,
    [classes.outline]: !!outline,
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
