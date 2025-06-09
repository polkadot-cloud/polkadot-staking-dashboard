// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import classes from './index.module.scss'
import type { SelectItemProps } from './types'

export const SelectItem = ({
  title,
  subtitle,
  icon,
  selected,
  onClick,
  layout,
  hoverBorder = false,
  grow = true,
  disabled = false,
  includeToggle = true,
  bodyRef,
  containerRef,
}: SelectItemProps) => {
  const wrapperClasses = classNames(classes.wrapper, {
    [classes.grow]: grow,
    [classes.twoCol]: layout === 'two-col',
    [classes.threeCol]: layout === 'three-col',
  })

  const innerClasses = classNames('inner', {
    [classes.selected]: selected,
    [classes.hoverBorder]: hoverBorder,
  })

  const toggleClasses = classNames('toggle', {
    [classes.selected]: selected,
  })

  return (
    <div className={wrapperClasses}>
      <div className={innerClasses} ref={containerRef}>
        <button type="button" onClick={() => onClick()} disabled={disabled}>
          <div className="icon">{icon}</div>
          <div className="body" ref={bodyRef}>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          {includeToggle ? (
            <div className={toggleClasses}>
              <FontAwesomeIcon
                icon={selected ? faCircleCheck : faCircle}
                transform="grow-6"
              />
            </div>
          ) : null}
        </button>
      </div>
    </div>
  )
}
