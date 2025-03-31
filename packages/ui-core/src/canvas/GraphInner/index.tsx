// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import type { ComponentBase } from 'types'
import classes from './index.module.scss'

type Props = ComponentBase & {
  width: string | number
  height: string | number
}
export const GraphInner = forwardRef(
  (
    { width, height, children, style }: Props,
    ref: ForwardedRef<HTMLDivElement | null>
  ) => (
    <div
      className={classes.graphInner}
      style={{ width, height, ...style }}
      ref={ref}
    >
      <div className={classes.inner}>{children}</div>
    </div>
  )
)

GraphInner.displayName = 'GraphInner'
