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
  className,
}: ButtonHeaderProps) => {
  const allClasses = classNames(classes.btnHeader, {
    [classes.marginLeft]: marginLeft,
  })

  return (
    <button
      type="button"
      className={`${className ? `${className} ` : ``}${allClasses}`}
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
  className,
  active,
  acknowledged,
}: InactiveButtonHeaderProps) => {
  const allClasses = classNames(classes.btnHeader, {
    [classes.marginLeft]: marginLeft,
  })
  const activeClasses = classNames(classes.active, {
    [classes.pulse]: !acknowledged,
  })
  return (
    <div
      className={`${className ? `${className} ` : ``}${allClasses}`}
      style={style}
    >
      <FontAwesomeIcon icon={icon} transform={iconTransform} />
      {active && <span className={activeClasses} />}
    </div>
  )
}
