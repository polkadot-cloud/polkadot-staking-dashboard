// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

export const ButtonList = ({
  children,
  style,
  forceHeight,
}: ComponentBaseWithClassName & {
  forceHeight?: boolean
}) => {
  const allClasses = classNames(classes.btnList, {
    [classes.forceHeight]: !!forceHeight,
  })
  return (
    <div className={allClasses} style={style}>
      <div className={classes.inner}>{children}</div>
    </div>
  )
}
