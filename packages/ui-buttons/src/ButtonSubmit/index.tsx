// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onMouseHandlers } from '../util';
import type { ButtonSubmitProps } from './types';
import commonClasses from '../common.module.scss';
import classes from './index.module.scss';
import classNames from 'classnames';

/**
 * @name ButtonSubmit
 * @description A customizable submit button component used for form submissions or primary actions
 * within the interface.
 *
 * @returns {JSX.Element} The rendered ButtonSubmit component, styled according to the provided
 * props and supporting additional customization for icons, colors, and margins.
 */
export const ButtonSubmit = (props: ButtonSubmitProps): JSX.Element => {
  const {
    colorSecondary,
    disabled,
    grow,
    iconLeft,
    iconRight,
    iconTransform,
    marginLeft,
    marginRight,
    marginX,
    className,
    style,
    text,
    lg,
    pulse,
    onClick,
    onMouseOver,
    onMouseMove,
    onMouseOut,
  } = props;

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnSubmit,
    {
      [commonClasses.btnGrow]: grow,
      [commonClasses.btnSpacingLeft]: marginLeft,
      [commonClasses.btnSpacingRight]: marginRight,
      [commonClasses.btnMarginX]: marginX,
      [commonClasses.btnDisabled]: disabled,
      [commonClasses.btnActiveTransforms]: !disabled,
      [classes.btnSubmitLg]: lg,
      [classes.btnSubmitSm]: !lg,
      [classes.btnSubmitSecondaryColor]: colorSecondary,
      [classes.btnSubmitPulse]: pulse,
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
