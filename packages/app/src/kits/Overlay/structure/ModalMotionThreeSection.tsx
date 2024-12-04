// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion'
import type { ModalAnimationProps } from '../types'

/**
 * @name ModalMotionThreeSection
 * @summary Three section wrapper with motion animation.
 */
export const ModalMotionThreeSection = ({
  children,
  ...rest
}: ModalAnimationProps) => (
  <motion.div className="modal-motion-three-sections" {...rest}>
    {children}
  </motion.div>
)
