/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@polkadot-cloud/core/css/buttons/ButtonPrimaryInvert/index.css';
import type { ComponentBaseWithClassName } from 'types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';
import { onMouseHandlers } from '../Utils';
import { appendOr, appendOrEmpty } from '@polkadot-cloud/utils';

export type ButtonPrimaryInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    // use secondary network color.
    colorSecondary?: boolean;
    // large button, small otherwise.
    lg?: boolean;
    // button text.
    text: string;
  };

/**
 * @name ButtonPrimaryInvert
 * @description Invert primary button style.
 */
export const ButtonPrimaryInvert = ({
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
}: ButtonPrimaryInvertProps) => (
  <button
    className={`btn-primary-invert${appendOrEmpty(
      colorSecondary,
      'secondary-color'
    )}${appendOrEmpty(grow, 'grow')}${appendOr(lg, 'lg', 'sm')}${appendOrEmpty(
      marginRight,
      'm-right'
    )}${appendOrEmpty(marginLeft, 'm-left')}${appendOrEmpty(marginX, 'm-x')}${
      className ? ` ${className}` : ''
    }`}
    style={style}
    type="button"
    disabled={disabled}
    {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
  >
    {iconLeft ? (
      <FontAwesomeIcon
        icon={iconLeft}
        className={text ? 'icon-left' : undefined}
        transform={iconTransform ? iconTransform : undefined}
      />
    ) : null}
    {text ? text : null}
    {iconRight ? (
      <FontAwesomeIcon
        icon={iconRight}
        className={text ? 'icon-right' : undefined}
        transform={iconTransform ? iconTransform : undefined}
      />
    ) : null}
  </button>
);
