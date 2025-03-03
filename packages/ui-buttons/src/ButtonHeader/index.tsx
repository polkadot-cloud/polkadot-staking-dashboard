// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import type { ButtonHeaderProps, InactiveButtonHeaderProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

export const ButtonHeader = ({
  marginLeft,
  style,
  disabled,
  icon,
  iconTransform,
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
}: ButtonHeaderProps) => {
  const allClasses = classNames(classes.btnHeader, {
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
      <FontAwesomeIcon icon={icon} transform={iconTransform} />
    </button>
  )
}

export const InactiveButtonHeader = ({
  marginLeft,
  style,
  icon,
  iconTransform,
}: InactiveButtonHeaderProps) => {
  const allClasses = classNames(classes.btnHeader, {
    [classes.marginLeft]: marginLeft,
  })

  return (
    <div className={allClasses} style={style}>
      <FontAwesomeIcon icon={icon} transform={iconTransform} />
    </div>
  )
}
