// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import type { ModalContentProps } from '../types';
import { appendOrEmpty } from '@w3ux/utils';

/**
 * @name ModalContent
 * @summary Modal content wrapper for `ModalContainer` and `CanvasContainer`.
 */
export const ModalContent = ({
  children,
  canvas,
  ...rest
}: ModalContentProps) => (
  <motion.div
    className={`modal-content${appendOrEmpty(canvas, 'canvas')}`}
    {...rest}
  >
    {children}
  </motion.div>
);
