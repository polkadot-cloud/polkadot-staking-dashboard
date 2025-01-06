// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import type { AnimationProps } from 'framer-motion'

export type BaseWithAnimation = ComponentBase & AnimationProps

export type CardProps = ComponentBase & {
  dimmed?: boolean
}
export type ContentProps = BaseWithAnimation & {
  canvas?: boolean
}

export type FixedTitleProps = ComponentBase & {
  withStyle?: boolean
}

export type NotesProps = ComponentBase & {
  withPadding?: boolean
}

export type PaddingProps = ComponentBase & {
  verticalOnly?: boolean
  horizontalOnly?: boolean
}

export type ScrollProps = ComponentBase & {
  size: string
}

export type SectionProps = ComponentBase & {
  type: 'tab' | 'carousel'
}

export type ContainerProps = BaseWithAnimation & {
  onClose: () => void
}
