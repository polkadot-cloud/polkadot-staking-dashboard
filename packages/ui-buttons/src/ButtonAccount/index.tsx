// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronDown,
  faChevronRight,
  faGlasses,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import classNames from 'classnames'
import type {
  ButtonAccountInactiveProps,
  ButtonAccountLabelProps,
} from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

export const ButtonAccountLabel = ({
  activeAccount,
  activeProxy,
  readOnly,
  open,
  className,
  marginLeft,
  style,
}: ButtonAccountLabelProps) => {
  const allClasses = classNames(classes.btnAccount, {
    [classes.marginLeft]: marginLeft,
  })
  const arrowClasses = classNames(classes.arrow, {
    [classes.open]: open,
  })

  const address = activeAccount?.address || ''
  const name = activeAccount?.name || ''

  const accountDisplay: string | null =
    address === null
      ? null
      : address !== ''
        ? name || ellipsisFn(address)
        : ellipsisFn(address)

  return (
    <div
      className={`${className ? `${className} ` : ' '}${allClasses}`}
      style={style}
    >
      <span className={classes.polkicon}>
        <Polkicon
          background="transparent"
          address={address}
          transform="grow-9"
        />
      </span>
      {accountDisplay}
      {activeProxy && <span className={classes.proxy}>/ Proxied</span>}
      {readOnly && (
        <FontAwesomeIcon icon={faGlasses} className={classes.icon} />
      )}
      <div className={arrowClasses}>
        <FontAwesomeIcon icon={faChevronDown} transform="shrink-5" />
      </div>
    </div>
  )
}

export const ButtonAccountInactive = ({
  label,
  className,
  marginLeft,
  style,
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
  disabled,
}: ButtonAccountInactiveProps) => {
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
