// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { AnimationProps } from 'framer-motion'
import { motion } from 'framer-motion'
import type { ComponentBase } from 'types'
import commonClasses from '../../common.module.scss'
import classes from './index.module.scss'

export const Container = ({
  children,
  ...rest
}: ComponentBase & AnimationProps) => {
  const allClasses = classNames(commonClasses.fixedPosition, classes.container)
  return (
    <motion.div className={allClasses} {...rest}>
      {children}
    </motion.div>
  )
}
