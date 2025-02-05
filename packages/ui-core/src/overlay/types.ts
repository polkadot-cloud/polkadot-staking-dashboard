// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import type { AnimationProps } from 'framer-motion'

export type BackdropProps = ComponentBase &
  AnimationProps & {
    blur?: string
  }
