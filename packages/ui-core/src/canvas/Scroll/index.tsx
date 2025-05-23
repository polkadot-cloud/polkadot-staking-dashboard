// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import type { ScrollProps } from '../types'
import classes from './index.module.scss'

export const Scroll = forwardRef<HTMLDivElement, ScrollProps>(
  ({ children, ...rest }, ref) => (
    <motion.div className={classes.scroll} {...rest}>
      <SimpleBar
        autoHide={true}
        style={{ height: '100%' }}
        scrollableNodeProps={{ ref }}
      >
        {children}
      </SimpleBar>
    </motion.div>
  )
)
