// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import type { ModalContentProps } from '../../../../ui-overlay/src/types'
import classes from './index.module.scss'

export const ModalContent = ({
  children,
  canvas,
  style,
}: ModalContentProps) => {
  const allClasses = classNames(classes.modalContent, {
    [classes.canvas]: canvas,
  })
  return (
    <motion.div className={allClasses} style={style}>
      {children}
    </motion.div>
  )
}
