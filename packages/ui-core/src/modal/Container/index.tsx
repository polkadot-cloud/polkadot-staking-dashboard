// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import commonClasses from '../../common.module.scss'
import type { ContainerProps } from '../types'
import classes from './index.module.scss'

export const Container = ({ children, onClose, ...rest }: ContainerProps) => {
  const allClasses = classNames(commonClasses.fixedPosition, classes.container)
  return (
    <motion.div className={allClasses} {...rest}>
      <div>
        {children}
        <button
          type="button"
          className={classes.close}
          onClick={() => onClose()}
        >
          &nbsp;
        </button>
      </div>
    </motion.div>
  )
}
