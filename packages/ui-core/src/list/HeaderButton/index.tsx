// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

export const HeaderButton = ({
  children,
  style,
  withText,
}: ComponentBase & {
  withText?: boolean
}) => {
  const allClasses = classNames(classes.headerButton, {
    [classes.text]: withText,
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
