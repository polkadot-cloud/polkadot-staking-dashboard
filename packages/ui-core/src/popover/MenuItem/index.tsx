// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import classes from './index.module.scss'

export const MenuItem = ({ children }: { children: ReactNode }) => {
  const allClasses = classNames(classes.menuItem)

  return <div className={allClasses}>{children}</div>
}

export const MenuItemButton = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
}) => {
  const allClasses = classNames(classes.menuItem)

  return (
    <button type="button" onClick={(e) => onClick(e)} className={allClasses}>
      {children}
    </button>
  )
}
