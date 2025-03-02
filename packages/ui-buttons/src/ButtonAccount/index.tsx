// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ButtonAccountProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

export const ButtonAccount = ({
  activeAccount,
  marginLeft,
  style,
  disabled,
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
}: ButtonAccountProps) => {
  const allClasses = classNames(classes.btnAccount, {
    [classes.marginLeft]: marginLeft,
  })

  return (
    <button
      type="button"
      className={allClasses}
      style={style}
      disabled={disabled}
      {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
    >
      {activeAccount}
    </button>
  )
}
