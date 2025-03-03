// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import classes from './index.module.scss'
import type { SideProps } from './types'

/**
 * @name Side
 * @summary An element that houses the side menu and transitions to a toggle-able fixed overlay on
 * smaller screens.
 * @summary Handles maximised and minimised transitions.
 */
export const Side = ({ children, style, open, minimised }: SideProps) => {
  const classses = classNames(classes.side, {
    [classes.sideHidden]: !open,
    [classes.sideMinimised]: minimised,
  })

  return (
    <div style={{ ...style }} className={classses}>
      {children}
    </div>
  )
}
