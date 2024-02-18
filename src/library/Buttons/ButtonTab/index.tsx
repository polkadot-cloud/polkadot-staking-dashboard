// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import '@polkadot-cloud/core/css/buttons/ButtonTab/index.css';
import type { ComponentBaseWithClassName } from 'types';
import type { ButtonCommonProps } from '../types';
import { appendOrEmpty } from '@polkadot-cloud/utils';
import { onMouseHandlers } from '../Utils';

export type ButtonTabProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    // whether the button is clicked
    active?: boolean;
    // the title of the button
    title: string;
    // a badge value can represent the main content of the tab page
    badge?: string | number;
  };

/**
 * @name ButtonTab
 * @description Tab button used throughout dashboard apps.
 */
export const ButtonTab = ({
  disabled,
  className,
  style,
  active,
  title,
  badge,
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
}: ButtonTabProps) => (
  <button
    className={`btn-tab${appendOrEmpty(active, 'active')}${
      className ? ` ${className}` : ''
    }`}
    style={style}
    type="button"
    disabled={disabled}
    {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
  >
    {title}
    {badge ? <span className="badge">{badge}</span> : null}
  </button>
);
