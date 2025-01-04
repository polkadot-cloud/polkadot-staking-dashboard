// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import commonClasses from '../common.module.scss'
import classes from './index.module.scss'

export const ModalMulti = ({ children }: ComponentBase) => {
  const allClasses = classNames(commonClasses.scrollBar, classes.multi)
  return <motion.div className={allClasses}>{children}</motion.div>
}
