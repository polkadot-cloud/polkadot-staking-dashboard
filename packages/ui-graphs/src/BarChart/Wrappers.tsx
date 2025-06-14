// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classes from './index.module.scss'
import type { BarChartWrapperProps, BarProps, LegendProps } from './types'

export const BarChartWrapper = ({
  children,
  lessPadding,
  style,
}: BarChartWrapperProps) => {
  const wrapperClass = lessPadding
    ? `${classes.barChartWrapper} ${classes.lessPadding}`
    : classes.barChartWrapper

  return (
    <div className={wrapperClass} style={style}>
      {children}
    </div>
  )
}

export const Legend = ({ children, className }: LegendProps) => {
  const legendClass = className
    ? `${classes.legend} ${className}`
    : classes.legend

  return <div className={legendClass}>{children}</div>
}

export const Bar = ({ children }: BarProps) => (
  <div className={classes.bar}>{children}</div>
)
