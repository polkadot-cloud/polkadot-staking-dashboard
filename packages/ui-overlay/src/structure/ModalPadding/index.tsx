// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import type { ModalPaddingProps } from '../../types'
import classes from './index.module.scss'

export const ModalPadding = forwardRef(
  (
    { children, style, verticalOnly, horizontalOnly }: ModalPaddingProps,
    ref?: ForwardedRef<HTMLDivElement | null>
  ) => {
    const allClasses = classNames(classes.modalPadding, {
      [classes.verticalOnly]: verticalOnly,
      [classes.horizontalOnly]: horizontalOnly,
    })
    return (
      <div ref={ref} className={allClasses} style={style}>
        {children}
      </div>
    )
  }
)

ModalPadding.displayName = 'ModalPadding'
