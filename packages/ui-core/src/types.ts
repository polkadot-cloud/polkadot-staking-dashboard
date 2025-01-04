// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'

export type RowProps = ComponentBase & {
  // whether there is margin space vertically.
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
  // whether the title stick on the same position.
  sticky?: boolean
  // an array of tab pages.
  tabs?: PageTitleTabProps[]
}

export interface PageTitleTabProps {
  // whether the title stick on the same position.
  sticky?: boolean
  // title of the tab button.
  title: string
  // whether it is clicked.
  active: boolean
  // it leads to the corresponding tab page.
  onClick: () => void
  // a badge that can have a glance at before visting the tab page.
  badge?: string | number
  // whether the tab button is disabled.
  disabled?: boolean
}
