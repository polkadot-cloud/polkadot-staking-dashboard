// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ModalNotesProps } from '../types'
import classes from './index.module.scss'

export const ModalNotes = ({
  children,
  style,
  withPadding,
}: ModalNotesProps) => {
  const allClasses = classNames(classes.modalNotes, {
    [classes.withPadding]: withPadding,
  })
  return (
    <div className={allClasses} style={style}>
      {children}
    </div>
  )
}
