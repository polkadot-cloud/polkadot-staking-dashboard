// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
