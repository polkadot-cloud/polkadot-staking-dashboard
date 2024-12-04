// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import type { AnimationProps } from 'framer-motion'

export type ModalAnimationProps = ComponentBase & AnimationProps

export type CanvasScrollProps = ModalAnimationProps & {
  // the maximum width of the canvas.
  size?: 'lg' | 'xl'
  // allow scrolling.
  scroll?: boolean
}

export type ModalConnectItemProps = ComponentBase & {
  // whether the item can be connected to.
  canConnect?: boolean
}

export type ModalContentProps = ModalAnimationProps & {
  // include canvas styling.
  canvas?: boolean
}

export type ModalFixedTitleProps = ComponentBase & {
  // whether there is customized css.
  withStyle?: boolean
}

export type ModalNotesProps = ComponentBase & {
  // whether there is padding vertically.
  withPadding?: boolean
}

export type ModalOverlayProps = ModalAnimationProps & {
  // the amount of blur to apply to the backdrop.
  blur?: string
}

export type ModalPaddingProps = ComponentBase & {
  // whether there is only vertical padding.
  verticalOnly?: boolean
  // whether there is only horizontal padding.
  horizontalOnly?: boolean
}

export type ModalScrollProps = ComponentBase & {
  // the maximum width.
  size: string
}

export type ModalSectionProps = ComponentBase & {
  // the type of window (tab | carousel).
  type: 'tab' | 'carousel'
}

export type ModalWarningsProps = ComponentBase & {
  // whether there is margin on top.
  withMargin?: boolean
}
