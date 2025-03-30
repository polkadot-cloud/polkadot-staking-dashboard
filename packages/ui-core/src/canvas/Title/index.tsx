// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

export const Title = ({
  children,
  style,
  fullWidth,
}: ComponentBase & {
  fullWidth?: boolean
}) => {
  const allClasses = classNames(classes.title, {
    [classes.fullWidth]: !!fullWidth,
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
