// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import type { ModalOverlayProps } from '../../types'
import commonClasses from '../common.module.scss'
import classes from './index.module.scss'

export const OverlayBackground = ({
  children,
  blur,
  ...rest
}: ModalOverlayProps) => {
  const allClasses = classNames(
    commonClasses.fixedPosition,
    classes.overlayBackground
  )
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
