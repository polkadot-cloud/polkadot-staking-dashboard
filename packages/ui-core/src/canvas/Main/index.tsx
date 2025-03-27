// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import type { CanvasSize } from 'types'
import classes from './index.module.scss'

export const Main = ({
  children,
  style,
  size,
}: ComponentBase & {
  size?: CanvasSize
}) => {
  const allClasses = classNames(classes.main, {
    [classes.lg]: size === 'lg',
    [classes.xl]: size === 'xl',
  })

  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
