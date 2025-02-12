// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'

export type RowProps = ComponentBase & {
  yMargin?: boolean
  xMargin?: boolean
}

export type PageTitleProps = PageTitleTabsProps & {
  colorSecondary?: boolean
  tabClassName?: string
  inline?: boolean
  title?: string
  button?: {
    title: string
    onClick: () => void
  }
}

export interface PageTitleTabsProps {
  sticky?: boolean
  tabs?: PageTitleTabProps[]
}

export interface PageTitleTabProps {
  sticky?: boolean
  title: string
  active: boolean
  onClick: () => void
  badge?: string | number
  disabled?: boolean
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
