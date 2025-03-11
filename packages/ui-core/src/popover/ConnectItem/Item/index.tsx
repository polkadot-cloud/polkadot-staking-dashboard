// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import classNames from 'classnames'
import classes from './index.module.scss'

export const Item = ({
  children,
  last,
  asButton,
  onClick,
}: {
  children: React.ReactNode
  last?: boolean
  asButton?: boolean
  onClick?: () => void
}) => {
  const allClasses = classNames(classes.item, {
    [classes.asButton]: !!asButton,
    [classes.last]: !!last,
  })
  return (
    <div className={allClasses} onClick={onClick}>
      {children}
    </div>
  )
}
