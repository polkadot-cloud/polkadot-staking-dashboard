// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useState } from 'react'
import { Tooltip } from 'ui-core/base'
import type { ButtonCopyProps } from '../types'
import classes from './index.module.scss'

export const ButtonCopy = ({
  onClick,
  value,
  size,
  tooltipPortalContainer,
  xMargin,
}: ButtonCopyProps) => {
  const [active, setActive] = useState<boolean>(false)

  const handleClick = () => {
    setActive(true)
  }

  const baseClasses = classNames(classes.btnCopy, {
    [classes.xMargin]: xMargin,
  })

  const copyClasses = classNames(classes.copyIcon, {
    [classes.active]: active,
    [classes.inheritSize]: size == undefined,
  })

  const checkClasses = classNames(classes.checkIcon, {
    [classes.active]: active,
    [classes.inheritSize]: size === undefined,
  })

  const tooltipText = active ? 'Copied!' : 'Copy'

  return (
    <Tooltip
      text={tooltipText}
      container={tooltipPortalContainer}
      onTriggerClick={(event) => {
        event.preventDefault()
      }}
      onPointerDownOutside={(event) => {
        event.preventDefault()
      }}
    >
      <button
        type="button"
        style={size ? { width: size, height: size } : {}}
        className={baseClasses}
        onClick={() => {
          if (typeof onClick === 'function') {
            onClick()
          }
          navigator.clipboard.writeText(value)
          handleClick()
        }}
      >
        <span
          className={copyClasses}
          onAnimationEnd={() => {
            setActive(false)
          }}
        >
          <FontAwesomeIcon icon={faCopy} className={classes.icon} />
        </span>
        <span className={checkClasses}>
          <FontAwesomeIcon icon={faCheck} className={classes.icon} />
        </span>
      </button>
    </Tooltip>
  )
}
