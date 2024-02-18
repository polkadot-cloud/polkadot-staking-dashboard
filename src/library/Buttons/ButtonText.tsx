/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import '@polkadot-cloud/core/css/buttons/ButtonText/index.css';
import type { ComponentBaseWithClassName } from 'types';
import type { ButtonCommonProps, ButtonIconProps } from './types';
import { onMouseHandlers } from './Utils';
import { appendOrEmpty } from '@polkadot-cloud/utils';

export type ButtonMonoProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    // button text.
    text: string;
  };

/**
 * @name ButtonText
 * @description Plain button style used within the main interface of dashboards.
 */
export const ButtonText = ({
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
}: ButtonMonoProps) => (
  <motion.button
    whileHover={{ scale: !disabled ? 1.02 : 1 }}
    whileTap={{ scale: !disabled ? 0.98 : 1 }}
    className={`btn-text${appendOrEmpty(grow, 'grow')}${appendOrEmpty(
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
  </motion.button>
);
