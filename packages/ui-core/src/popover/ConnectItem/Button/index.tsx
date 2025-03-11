// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import type { MouseEvent as ReactMouseEvent } from 'react'
import classes from './index.module.scss'

export const Button = ({
  active,
  faIcon,
  onClick,
  disabled,
}: ComponentBase & {
  active?: boolean
  faIcon: IconDefinition
  onClick: (ev: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled: boolean
}) => {
  const allClasses = classNames(classes.button, {
    [classes.active]: !!active,
  })
  return (
    <button className={allClasses} onClick={onClick} disabled={disabled}>
      <FontAwesomeIcon icon={faIcon} />
    </button>
  )
}
