// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps } from './types';
import { appendOrEmpty } from '@w3ux/utils';
import { onMouseHandlers } from './Utils';

export type ButtonOptionProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    // button content including icon and html styling.
    content?: boolean;
  };

/**
 * @name ButtonOption
 * @description Option button for different action.
 */
export const ButtonOption = ({
  children,
  className,
  style,
  disabled,
  content,
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
}: ButtonOptionProps) => (
  <button
    className={`btn-option${appendOrEmpty(content, 'content')}${
      className ? ` ${className}` : ''
    }`}
    style={style}
    type="button"
    disabled={disabled}
    {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
  >
    {children}
    <div>
      <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
    </div>
  </button>
);
