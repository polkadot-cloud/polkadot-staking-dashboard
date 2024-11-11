// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { onMouseHandlers } from '../util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './index.module.scss';
import commonClasses from '../common.module.scss';
import classNames from 'classnames';
import type { ButtonPrimaryProps } from './types';

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
    lg,
    marginLeft,
    marginRight,
    marginX,
    onClick,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    style,
    text,
  } = props;

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnPrimary,
    {
      [commonClasses.btnLarge]: lg,
      [commonClasses.btnSmall]: !lg,
      [commonClasses.btnGrow]: grow,
      [commonClasses.btnSpacingLeft]: marginLeft,
      [commonClasses.btnSpacingRight]: marginRight,
      [commonClasses.btnMarginX]: marginX,
      [commonClasses.btnDisabled]: disabled,
      [commonClasses.btnActiveTransforms]: !disabled,
      [classes.btnPrimary_secondaryColor]: colorSecondary,
    },
    className
  );

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
  );
};
