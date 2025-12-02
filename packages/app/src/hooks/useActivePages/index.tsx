// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import { PageCategories, PagesConfig } from 'config/pages'
import { ActivePagesKey } from 'consts'
import type { NavSection } from 'types'

// Type for storing active pages per category
export type ActivePagesRecord = Partial<Record<NavSection, string>>

// Default active pages (using default routes from PageCategories)
const getDefaultActivePages = (): ActivePagesRecord => {
	const defaults: ActivePagesRecord = {}
	for (const category of PageCategories) {
		defaults[category.key] = category.defaultRoute
	}
	return defaults
}

// Get active pages from local storage
export const getActivePages = (): ActivePagesRecord => {
	try {
		const stored = localStorageOrDefault(
			ActivePagesKey,
			getDefaultActivePages(),
			true,
		) as ActivePagesRecord
		return stored
	} catch {
		return getDefaultActivePages()
	}
}

// Set active page for a category in local storage
export const setActivePage = (category: NavSection, route: string): void => {
	// Validate that the route belongs to the category
	const pageConfig = PagesConfig.find((page) => page.hash === route)
	const categoryConfig = PageCategories.find((cat) => cat.key === category)

	if (
		pageConfig &&
		categoryConfig &&
		pageConfig.category === categoryConfig.id
	) {
		const activePages = getActivePages()
		activePages[category] = route
		localStorage.setItem(ActivePagesKey, JSON.stringify(activePages))
	}
}

// Get active page for a specific category
export const getActivePageForCategory = (category: NavSection): string => {
	const activePages = getActivePages()
	const storedPage = activePages[category]

	// Fall back to default route if stored page doesn't exist
	const categoryConfig = PageCategories.find((cat) => cat.key === category)
	const defaultFallback = PageCategories[0]?.defaultRoute || '/overview'
	return storedPage || categoryConfig?.defaultRoute || defaultFallback
}
