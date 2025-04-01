// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import type { ScrollProps } from '../types'
import classes from './index.module.scss'

export const Scroll = ({ children, size, ...rest }: ScrollProps) => {
  const allClasses = classNames(classes.scroll, {
    [classes.lg]: size === 'lg',
    [classes.xl]: size === 'xl',
  })

  return (
    <motion.div className={allClasses} {...rest}>
      {children}
    </motion.div>
  )
}
