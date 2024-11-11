// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { onMouseHandlers } from '../util';
import type { ButtonTabProps } from './types';
import classNames from 'classnames';
import commonClasses from '../common.module.scss';
import classes from './index.module.scss';

/**
 * @name ButtonTab
 * @description A tab-style button component used to represent selectable tabs within an interface.
 * This component supports active states, badges for additional information, and customizable styles
 * and event handling, making it suitable for interactive tab navigation or selection.
 *
 * @returns {JSX.Element} The rendered ButtonTab component, styled according to the provided props
 * and supporting additional customization for icons, colors, and margins.
 */
export const ButtonTab = (props: ButtonTabProps): JSX.Element => {
  const {
    disabled,
    className,
    style,
    active,
    title,
    badge,
    onClick,
    colorSecondary,
    onMouseOver,
    onMouseMove,
    onMouseOut,
  } = props;

  const activeClass = colorSecondary
    ? classes.btnTab_secondaryColor_active
    : classes.btnTab_active;

  const buttonClasses = classNames(
    commonClasses.btnCore,
    classes.btnTab,
    {
      [commonClasses.btnDisabled]: disabled,
      [activeClass]: active,
      [classes.btnTab_secondaryColor]: colorSecondary,
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
      <span className={classes.btnTab_inner}>
        {title}
        {badge && <span className={classes.btnTab_badge}>{badge}</span>}
      </span>
    </button>
  );
};
