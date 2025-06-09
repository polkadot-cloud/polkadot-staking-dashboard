// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { HeadingProps } from '../types'
import classes from './index.module.scss'

export const Heading = ({ title, minimised }: HeadingProps) => {
  const allClasses = classNames(classes.wrapper, {
    [classes.minimised]: minimised,
  })

  return (
    <div className={allClasses}>
      {minimised ? <h5>&bull;</h5> : <h5>{title}</h5>}
    </div>
  )
}
