// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { motion } from 'framer-motion'
import commonClasses from '../../common.module.scss'
import { useOverlay } from '../../Provider'
import type { ModalAnimationProps } from '../../types'
import classes from './index.module.scss'

export const ModalContainer = ({ children, ...rest }: ModalAnimationProps) => {
  const {
    modal: { setModalStatus },
  } = useOverlay()

  const allClasses = classNames(
    commonClasses.fixedPosition,
    classes.modalContainer
  )
  return (
    <motion.div className={allClasses} {...rest}>
      <div>
        {children}
        <button
          type="button"
          className={classes.close}
          onClick={() => setModalStatus('closing')}
        >
          &nbsp;
        </button>
      </div>
    </motion.div>
  )
}
