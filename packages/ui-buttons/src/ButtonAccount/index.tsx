// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import classNames from 'classnames'
import type { ButtonAccountProps } from '../types'
import classes from './index.module.scss'

export const ButtonAccount = ({
  activeAccount,
  activeProxy,
  className,
  readOnly,
  marginLeft,
  style,
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
    <div
      className={`${className ? `${className} ` : ' '}${allClasses}`}
      style={style}
    >
      <span
        style={{
          marginRight: '1.25rem',
        }}
      >
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
    </div>
  )
}
