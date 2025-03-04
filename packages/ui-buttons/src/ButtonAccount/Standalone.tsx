// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import type { ButtonAccountStandaloneProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

export const Standalone = ({
  label,
  className,
  marginLeft,
  style,
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
  disabled,
}: ButtonAccountStandaloneProps) => {
  const allClasses = classNames(classes.btnAccount, {
    [classes.marginLeft]: marginLeft,
  })
  const arrowClasses = classNames(classes.arrow, classes.noBorder)

  return (
    <button
      type="button"
      className={`${className ? `${className} ` : ' '}${allClasses}`}
      style={style}
      disabled={disabled}
      {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
    >
      {label}
      <div className={arrowClasses}>
        <FontAwesomeIcon icon={faChevronRight} transform="shrink-5" />
      </div>
    </button>
  )
}
