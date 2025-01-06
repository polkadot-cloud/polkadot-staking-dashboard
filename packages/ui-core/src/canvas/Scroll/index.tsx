// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion'
import type { CanvasScrollProps } from '../types'
import classes from './index.module.scss'

export const Scroll = ({ children, size, ...rest }: CanvasScrollProps) => (
  <motion.div
    className={`${classes.canvasScroll} ${size === 'xl' ? classes.xl : ''}`}
    {...rest}
  >
    {children}
  </motion.div>
)
