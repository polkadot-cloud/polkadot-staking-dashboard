// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ButtonModalProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

export const ButtonModal = ({
  text,
  label,
  selected,
  className,
  disabled,
  style,
  onClick,
  onMouseMove,
  onMouseOut,
  onMouseOver,
}: ButtonModalProps) => {
  const allClasses = classNames(classes.btnModal, className, {
    [classes.btnModalSelected]: selected,
    [classes.btnModalDisabled]: disabled,
  })

  return (
    <button
      type="button"
      className={allClasses}
      style={style}
      disabled={disabled}
      {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
    >
      <h3>{text}</h3>
      <h5>{label}</h5>
    </button>
  )
}
