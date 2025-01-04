// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ModalSectionProps } from '../../../../ui-overlay/src/types'
import classes from './index.module.scss'

export const ModalSection = ({ children, style, type }: ModalSectionProps) => {
  const allClasses = classNames({
    [classes.carousel]: type === 'carousel',
    [classes.tab]: type === 'tab',
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
