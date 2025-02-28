// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import { appendOrEmpty } from '@w3ux/utils';
import type { CanvasScrollProps } from '../types';

/**
 * @name CanvasScroll
 * @summary Canvas scrollable container.
 */
export const CanvasScroll = ({
  children,
  size,
  scroll = true,
  ...rest
}: CanvasScrollProps) => (
  <motion.div
    className={`canvas-scroll${appendOrEmpty(size === 'xl', 'xl')}${appendOrEmpty(
      scroll,
      'scroll'
    )}`}
    {...rest}
  >
    {children}
  </motion.div>
);
