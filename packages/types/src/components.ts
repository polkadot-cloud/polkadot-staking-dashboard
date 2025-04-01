// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { CSSProperties, ReactNode } from 'react'

export interface ComponentBase {
  children?: ReactNode
  style?: CSSProperties
}

export type ComponentBaseWithClassName = ComponentBase & {
  className?: string
}
