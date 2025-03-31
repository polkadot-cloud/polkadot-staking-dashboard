// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnimationProps } from 'framer-motion'
import type { ComponentBase } from 'types'

export type ScrollProps = ComponentBase &
  AnimationProps & {
    size?: 'lg' | 'xl'
  }
