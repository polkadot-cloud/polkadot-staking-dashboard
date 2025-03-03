// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import classes from './index.module.scss'

/**
 * @name Container
 * @summary Page container.
 */
export const Container = ({ children, style }: ComponentBase) => {
  const allClasses = classNames(classes.container, 'container-width')
  return (
    <div className={allClasses} style={{ ...style }}>
      {children}
    </div>
  )
}
