// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import classes from './index.module.scss'

export const TokenInput = ({
  onChange,
  placeholder,
  value,
  marginY,
  id,
  label,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  const allClasses = classNames(classes.tokenInput, {
    [classes.marginY]: !!marginY,
  })

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={allClasses}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
      />
    </>
  )
}
