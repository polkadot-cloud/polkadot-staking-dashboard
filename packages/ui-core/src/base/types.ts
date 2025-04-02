// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'

export type RowProps = ComponentBase & {
  yMargin?: boolean
  xMargin?: boolean
}

export type TooltipAreaProps = ComponentBase & {
  text: string
  pointer?: boolean
  onMouseMove: () => void
  onClick?: () => void
}

export type IdentityProps = ComponentBase & {
  Icon: React.ReactNode
  Action?: React.ReactNode
  label: string
  value: string
}
