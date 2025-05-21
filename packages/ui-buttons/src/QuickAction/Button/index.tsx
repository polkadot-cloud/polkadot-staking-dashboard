// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { ButtonQuickActionProps } from '../../types'
import classes from './index.module.scss'

export const Button = ({
  onClick,
  label,
  disabled,
  Icon,
}: ButtonQuickActionProps) => {
  const buttonClasses = classNames(classes.btnQuickAction, {
    [classes.disabled]: disabled,
  })

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      <Icon className={classes.icon} />
      <h4>{label}</h4>
    </button>
  )
}
