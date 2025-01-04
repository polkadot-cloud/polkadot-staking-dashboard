// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import type { ModalCardProps } from '../types'
import classes from './index.module.scss'

export const ModalCard = forwardRef(
  (
    { children, dimmed, style }: ModalCardProps,
    ref?: ForwardedRef<HTMLDivElement | null>
  ) => {
    const allClasses = classNames(classes.modalCard, {
      [classes.dimmed]: dimmed,
    })
    return (
      <div ref={ref} className={allClasses} style={style}>
        {children}
      </div>
    )
  }
)

ModalCard.displayName = 'ModalCard'
