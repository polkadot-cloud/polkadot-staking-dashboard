// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import commonClasses from '../common.module.scss'
import type { ButtonPrimaryProps } from '../types'
import { onMouseHandlers } from '../util'
import classes from './index.module.scss'

/**
 * @name ButtonPrimary
 * @description Primary button style used within the main interface of the dashboard. This button
 * component supports icons, conditional styling, and dynamic sizing and margin options.
 *
 * @param {ButtonPrimaryProps} props - The props for the ButtonPrimary component.
 * @returns {JSX.Element} The rendered primary button component.
 */
export const ButtonPrimary = (props: ButtonPrimaryProps): JSX.Element => {
  const {
    className,
    colorSecondary,
    disabled,
    grow,
    iconLeft,
    iconRight,
    iconTransform,
    size = 'sm',
    marginLeft,
    marginRight,
    marginX,
    onClick,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    style,
    text,
    asLabel,
  } = props

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnPrimary,
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
      [classes.btnPrimarySecondaryColor]: colorSecondary,
    },
    className
  )

  const buttonContent = (
    <>
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
    </>
  )

  if (asLabel) {
    return (
      <div className={buttonClasses} style={style}>
        {buttonContent}
      </div>
    )
  }

  return (
    <button
      className={buttonClasses}
      style={style}
      type="button"
      disabled={disabled}
      {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
    >
      {buttonContent}
    </button>
  )
}
