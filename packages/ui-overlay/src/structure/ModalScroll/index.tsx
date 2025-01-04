// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import commonClasses from '../../common.module.scss'
import type { ModalScrollProps } from '../../types'
import classes from './index.module.scss'

export const ModalScroll = forwardRef(
  (
    { size, children, style }: ModalScrollProps,
    ref?: ForwardedRef<HTMLDivElement>
  ) => {
    const allClasses = classNames(
      classes.modalScroll,
      commonClasses.scrollBar,
      {
        [classes.lg]: size === 'lg',
        [classes.xl]: size === 'xl',
      }
    )
    return (
      <div ref={ref} className={allClasses} style={style}>
        {children}
      </div>
    )
  }
)
ModalScroll.displayName = 'ModalScroll'
