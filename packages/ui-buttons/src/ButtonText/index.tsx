// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import commonClasses from '../common.module.scss';
import { onMouseHandlers } from '../util';
import classes from './index.module.scss';
import type { ButtonTextProps } from './types';

/**
 * @name ButtonText
 * @description Plain button style used within the main interface of dashboards.
 *
 * @param {ButtonTextProps} props - The props for the ButtonText component.
 * @returns {JSX.Element} The rendered primary button component.
 */
export const ButtonText = (props: ButtonTextProps): JSX.Element => {
  const {
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
    onClick,
    onMouseOver,
    onMouseMove,
    onMouseOut,
  } = props;

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnText,
    {
      [commonClasses.btnGrow]: grow,
      [commonClasses.btnSpacingLeft]: marginLeft,
      [commonClasses.btnSpacingRight]: marginRight,
      [commonClasses.btnMarginX]: marginX,
      [commonClasses.btnDisabled]: disabled,
      [commonClasses.btnActiveTransforms]: !disabled,
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
