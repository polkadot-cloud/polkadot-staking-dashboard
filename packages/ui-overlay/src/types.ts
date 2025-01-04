// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import type { AnimationProps } from 'framer-motion'

export type ModalAnimationProps = ComponentBase & AnimationProps

export type CanvasScrollProps = ModalAnimationProps & {
  size?: 'lg' | 'xl'
}

export type ModalCardProps = ComponentBase & {
  dimmed?: boolean
}
export type ModalContentProps = ModalAnimationProps & {
  canvas?: boolean
}

export type ModalFixedTitleProps = ComponentBase & {
  withStyle?: boolean
}

export type ModalNotesProps = ComponentBase & {
  withPadding?: boolean
}

export type ModalOverlayProps = ModalAnimationProps & {
  blur?: string
}

export type ModalPaddingProps = ComponentBase & {
  verticalOnly?: boolean
  horizontalOnly?: boolean
}

export type ModalScrollProps = ComponentBase & {
  size: string
}

export type ModalSectionProps = ComponentBase & {
  type: 'tab' | 'carousel'
}
