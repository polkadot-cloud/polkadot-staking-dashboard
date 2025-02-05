// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import commonClasses from '../../common.module.scss'
import type { BackdropProps } from '../types'
import classes from './index.module.scss'

export const Backdrop = ({ children, blur, ...rest }: BackdropProps) => {
  const allClasses = classNames(commonClasses.fixedPosition, classes.backdrop)
  return (
    <motion.div
      style={blur ? { backdropFilter: `blur(${blur})` } : undefined}
      className={allClasses}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
