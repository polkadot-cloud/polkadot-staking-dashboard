// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import type { ComponentBase } from 'types'
import commonClasses from '../../common.module.scss'
import classes from './index.module.scss'

export const Multi = ({ children, style }: ComponentBase) => {
  const allClasses = classNames(commonClasses.scrollBar, classes.multi)
  return (
    <motion.div className={allClasses} style={style}>
      {children}
    </motion.div>
  )
}
