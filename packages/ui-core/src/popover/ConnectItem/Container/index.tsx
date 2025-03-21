// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import { motion } from 'framer-motion'
import classes from './index.module.scss'

export const Container = ({ style, children }: ComponentBase) => (
  <motion.div style={style} className={classes.container}>
    <div className={classes.scroll}>
      <div className={classes.inner}>{children}</div>
    </div>
  </motion.div>
)
