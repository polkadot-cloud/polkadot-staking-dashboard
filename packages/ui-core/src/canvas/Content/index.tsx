// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ComponentBase } from 'types'
import classes from './index.module.scss'

export const Content = ({
  children,
  style,
  size,
}: ComponentBase & { size?: string }) => {
  const allClasses = classNames(classes.content, {
    [classes.lg]: size === 'lg',
    [classes.xl]: size === 'xl',
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
