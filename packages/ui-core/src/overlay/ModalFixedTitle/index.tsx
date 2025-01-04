// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import type { ModalFixedTitleProps } from '../types'
import classes from './index.module.scss'

export const ModalFixedTitle = forwardRef(
  (
    { children, style, withStyle }: ModalFixedTitleProps,
    ref?: ForwardedRef<HTMLDivElement>
  ) => {
    const allClasses = classNames(classes.fixedTitle, {
      [classes.withStyle]: withStyle,
    })
    return (
      <div ref={ref} className={allClasses} style={style}>
        {children}
      </div>
    )
  }
)
ModalFixedTitle.displayName = 'ModalFixedTitle'
