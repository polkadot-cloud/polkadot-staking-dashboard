// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames';
import commonClasses from '../common.module.scss';
import classes from './index.module.scss';
import { onMouseHandlers } from '../util';
import type { ButtonHelpProps } from './types';

/**
 * @name ButtonHelp
 * @description A reusable help button component used throughout the dashboard applications. This button is
 * designed to display a help icon and supports various customization options such as different background
 * styles, outline modes, and margin controls. It is styled using CSS Modules for scoped styling.
 * @param {ButtonHelpProps} props - The props for the ButtonHelp component.
 *
 * @returns {JSX.Element} The rendered ButtonHelp component.
 */
export const ButtonHelp = (props: ButtonHelpProps): JSX.Element => {
  const {
    disabled,
    marginLeft,
    marginRight,
    marginX,
    className,
    style,
    onClick,
    onMouseOver,
    onMouseMove,
    onMouseOut,
    outline = false,
    background = 'primary',
  } = props;

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnHelp,
    {
      [classes.btnHelpSecondaryBackground]: background === 'secondary',
      [classes.btnHelpNoBackground]: background === 'none',
      [classes.btnHelpOutline]: outline,
      [commonClasses.btnSpacingLeft]: marginLeft,
      [commonClasses.btnSpacingRight]: marginRight,
      [commonClasses.marginLeft]: marginLeft,
      [commonClasses.btnMarginX]: marginX,
      [commonClasses.btnDisabled]: disabled,
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="100%"
        height="100%"
        className={classes.btnHelpIcon}
      >
        <path d="M32 15c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 14.5c-2.5 0-4.5 2-4.5 4.5v12c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V34c0-2.5-2-4.5-4.5-4.5z" />
      </svg>
    </button>
  );
};
