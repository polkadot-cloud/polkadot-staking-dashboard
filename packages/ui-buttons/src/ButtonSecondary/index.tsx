// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import commonClasses from '../common.module.scss'
import type { ButtonSecondaryProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

/**
 * @name ButtonSecondary
 * @description Primary button style used within the main interface of the dashboard. This button
 * component supports icons, conditional styling, and dynamic sizing and margin options.
 *
 * @param {ButtonSecondaryProps} props - The props for the ButtonSecondary component.
 * @returns {JSX.Element} The rendered primary button component.
 */
export const ButtonSecondary = (props: ButtonSecondaryProps): JSX.Element => {
  const {
    disabled,
    grow,
    iconLeft,
    iconRight,
    iconTransform,
    size = 'sm',
    marginLeft,
    marginRight,
    marginX,
    className,
    style,
    text,
    onClick,
    onMouseOver,
    onMouseMove,
    onMouseOut,
  } = props

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnSecondary,
    {
      [commonClasses.btnLarge]: size === 'lg',
      [commonClasses.btnMedium]: size === 'md',
      [commonClasses.btnSmall]: size === 'sm',
      [commonClasses.btnGrow]: grow,
      [commonClasses.btnSpacingLeft]: marginLeft,
      [commonClasses.btnSpacingRight]: marginRight,
      [commonClasses.btnMarginX]: marginX,
      [commonClasses.btnDisabled]: disabled,
      [commonClasses.btnActiveTransforms]: !disabled,
    },
    className
  )

  return (
    <button
      className={buttonClasses}
      style={style}
      type="button"
      disabled={disabled}
      {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
    >
      {iconLeft && (
        <FontAwesomeIcon
          icon={iconLeft}
          className={text && commonClasses.btnIconLeftSpacing}
          transform={iconTransform}
        />
      )}
      {text}
      {iconRight && (
        <FontAwesomeIcon
          icon={iconRight}
          className={text && commonClasses.btnIconRightSpacing}
          transform={iconTransform}
        />
      )}
    </button>
  )
}
