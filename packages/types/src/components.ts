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

export type PageTitleProps = ComponentBase & {
  tabs?: PageTitleTabProps[]
  colorSecondary?: boolean
  tabClassName?: string
  inline?: boolean
  title?: string
  sticky?: boolean
}

export interface PageTitleTabProps {
  sticky?: boolean
  title: string
  active: boolean
  onClick: () => void
  badge?: string | number
  disabled?: boolean
}
