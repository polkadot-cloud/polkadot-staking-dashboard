// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import classNames from 'classnames'
import type { ButtonAccountProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

export const ButtonAccount = ({
  activeAccount,
  className,
  readOnly,
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

  const address = activeAccount?.address || ''
  const name = activeAccount?.name || ''

  const accountDisplay: string | null =
    address === null
      ? null
      : address !== ''
        ? name || ellipsisFn(address)
        : ellipsisFn(address)

  return (
    <button
      type="button"
      className={`${className ? `${className} ` : ' '}${allClasses}`}
      style={style}
      disabled={disabled}
      {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
    >
      <span style={{ marginRight: '1.25rem' }}>
        <Polkicon
          background="rgba(255,255,255,0.8)"
          address={address}
          transform="grow-7"
        />
      </span>
      {accountDisplay}
      {readOnly && (
        <FontAwesomeIcon icon={faGlasses} className={classes.icon} />
      )}
    </button>
  )
}
