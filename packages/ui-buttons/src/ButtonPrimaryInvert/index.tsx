// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ButtonPrimaryInvertProps } from './types';
import { onMouseHandlers } from '../util';
import classes from './index.module.scss';
import commonClasses from '../common.module.scss';
import classNames from 'classnames';

/**
 * @name ButtonPrimaryInvert
 * @description Primary button style used within the main interface of the dashboard. This button
 * component supports icons, conditional styling, and dynamic sizing and margin options.
 *
 * @param {ButtonPrimaryInvertProps} props - The props for the ButtonPrimary component.
 * @returns {JSX.Element} The rendered primary button component.
 */
export const ButtonPrimaryInvert = (
  props: ButtonPrimaryInvertProps
): JSX.Element => {
  const {
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
    className,
    style,
    text,
    onClick,
    onMouseOver,
    onMouseMove,
    onMouseOut,
  } = props;

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnPrimaryInvert,
    {
      [commonClasses.btnLarge]: lg,
      [commonClasses.btnSmall]: !lg,
      [commonClasses.btnGrow]: grow,
      [commonClasses.btnSpacingLeft]: marginLeft,
      [commonClasses.btnSpacingRight]: marginRight,
      [commonClasses.btnMarginX]: marginX,
      [commonClasses.btnDisabled]: disabled,
      [commonClasses.btnActiveTransforms]: !disabled,
      [classes.btnPrimaryInvertSecondaryColor]: colorSecondary,
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
