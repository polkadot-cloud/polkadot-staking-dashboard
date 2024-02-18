// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import InfoSVG from '../svg/help.svg?react';
import '@polkadot-cloud/core/css/buttons/ButtonHelp/index.css';
import type { ComponentBaseWithClassName } from 'types';
import type { ButtonCommonProps } from '../types';
import { appendOrEmpty } from '@polkadot-cloud/utils';
import { onMouseHandlers } from '../Utils';

export type ButtonHelpProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    // background style.
    background?: 'primary' | 'secondary' | 'none';
    // optional border
    outline?: boolean;
  };

/**
 * @name ButtonHelp
 * @description Help button used throughout dashboard apps.
 */
export const ButtonHelp = ({
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
}: ButtonHelpProps) => (
  <button
    className={`btn-help${appendOrEmpty(
      background === 'secondary',
      'background-secondary'
    )}${appendOrEmpty(background === 'none', 'background-none')}${appendOrEmpty(
      outline,
      'outline'
    )}${appendOrEmpty(marginRight, 'm-right')}${appendOrEmpty(
      marginLeft,
      'm-left'
    )}${appendOrEmpty(marginX, 'm-x')}${className ? ` ${className}` : ''}`}
    style={style}
    type="button"
    disabled={disabled}
    {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
  >
    <InfoSVG />
  </button>
);
