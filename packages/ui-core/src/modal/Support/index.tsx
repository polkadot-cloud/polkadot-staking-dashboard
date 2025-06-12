// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import React from 'react'
import classes from './index.module.scss'

export interface SupportProps {
  className?: string
  children: React.ReactNode
}

export const Support = ({ className, children }: SupportProps) => (
  <div className={classNames(classes.support, className)}>{children}</div>
)
