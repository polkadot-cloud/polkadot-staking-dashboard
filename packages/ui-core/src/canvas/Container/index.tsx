// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import type { AnimationProps } from 'framer-motion'
import { motion } from 'framer-motion'
import commonClasses from '../../common.module.scss'
import classes from './index.module.scss'

export const Container = ({
  children,
  ...rest
}: ComponentBase & AnimationProps) => {
  const allClasses = classNames(
    commonClasses.fixedPosition,
    classes.canvasContainer
  )
  return (
    <motion.div className={allClasses} {...rest}>
      {children}
    </motion.div>
  )
}
