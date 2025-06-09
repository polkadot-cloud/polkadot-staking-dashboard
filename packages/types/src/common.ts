// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyJson = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = any

export interface PageCategory {
  id: number
  key: string
  advanced: boolean
}

export type PageCategoryItems = PageCategory[]

export interface PageItem {
  category: number
  key: string
  uri: string
  hash: string
  Entry: FC<PageProps>
  lottie: unknown
  advanced: boolean
  bullet?: BulletType
}

export type PagesConfigItems = PageItem[]

export interface PageProps {
  page: PageProp
}

interface PageProp {
  key: string
}

export type BulletType = 'success' | 'accent' | 'warning' | 'danger'
