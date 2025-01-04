// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import type { ModalAnimationProps } from '../../../../ui-overlay/src/types'
import commonClasses from '../common.module.scss'
import classes from './index.module.scss'

export const ModalMultiThree = ({ children, ...rest }: ModalAnimationProps) => {
  const allClasses = classNames(commonClasses.modalMulti, classes.multiThree)
  return (
    <motion.div className={allClasses} {...rest}>
      {children}
    </motion.div>
  )
}
