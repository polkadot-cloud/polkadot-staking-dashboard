// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import classes from './index.module.scss'

export const Close = ({
  onClose,
  sm,
}: {
  onClose: () => void
  sm?: boolean
}) => {
  const allClasses = classNames(classes.close, {
    [classes.sm]: !!sm,
  })
  return (
    <div className={allClasses}>
      <button type="button" onClick={() => onClose()}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  )
}
