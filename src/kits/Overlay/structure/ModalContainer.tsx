/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { motion } from 'framer-motion';
import type { ModalAnimationProps } from '../types';

/**
 * @name ModalContainer
 * @summary Modal container wrapper.
 */
export const ModalContainer = ({ children, ...rest }: ModalAnimationProps) => (
  <motion.div className="modal-container" {...rest}>
    {children}
  </motion.div>
);
