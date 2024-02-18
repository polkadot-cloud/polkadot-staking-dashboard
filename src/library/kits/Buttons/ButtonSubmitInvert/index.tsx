// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import type { ComponentBaseWithClassName } from 'types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';
import { onMouseHandlers } from '../Utils';
import { appendOr, appendOrEmpty } from '@polkadot-cloud/utils';

export type ButtonSubmitInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    // button text.
    text: string;
    // large button, small otherwise.
    lg?: boolean;
  };

/**
 * @name ButtonSubmitInvert
 * @description Invert submit button style used in modals.
 */
export const ButtonSubmitInvert = ({
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
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
}: ButtonSubmitInvertProps) => (
  <motion.button
    whileHover={{ scale: !disabled ? 1.02 : 1 }}
    whileTap={{ scale: !disabled ? 0.98 : 1 }}
    className={`btn-submit-invert${appendOr(lg, 'lg', 'sm')}${appendOrEmpty(
      grow,
      'grow'
    )}
    ${appendOrEmpty(marginRight, 'm-right')}${appendOrEmpty(
      marginLeft,
      'm-left'
    )}${appendOrEmpty(marginX, 'm-x')}${className ? ` ${className}` : ''}`}
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
  </motion.button>
);
