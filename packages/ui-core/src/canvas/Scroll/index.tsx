// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion'
import type { ScrollProps } from '../types'
import classes from './index.module.scss'

export const Scroll = ({ children, size, ...rest }: ScrollProps) => (
  <motion.div
    className={`${classes.scroll} ${size === 'xl' ? classes.xl : ''}`}
    {...rest}
  >
    {children}
  </motion.div>
)
