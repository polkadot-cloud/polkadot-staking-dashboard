// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import type { ModalAnimationProps } from '../types';

/**
 * @name CanvasContainer
 * @summary Modal background wrapper with a thick blurred backround, suitable for text content to
 * overlay it.
 */
export const CanvasContainer = ({ children, ...rest }: ModalAnimationProps) => (
  <motion.div className="modal-canvas" {...rest}>
    {children}
  </motion.div>
);
