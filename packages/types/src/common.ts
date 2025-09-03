// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { FC } from 'react'

// biome-ignore lint/suspicious/noExplicitAny: <>
export type AnyJson = any

// biome-ignore lint/suspicious/noExplicitAny: <>
export type AnyFunction = any

export interface PageCategory {
	id: number
	key: string
	advanced: boolean
	defaultRoute: string
}

export type PageCategoryItems = PageCategory[]

export interface PageItem {
	category: number
	key: string
	uri: string
	hash: string
	Entry: FC<PageProps>
	faIcon: IconProp
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
