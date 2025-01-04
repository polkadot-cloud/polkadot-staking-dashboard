// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'

export type RowProps = ComponentBase & {
  yMargin?: boolean
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
