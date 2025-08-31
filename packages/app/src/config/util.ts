// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isOperatorsSupported } from 'consts/util'
import type { NetworkId } from 'types'
import { PageCategories, PagesConfig } from './pages'

// Get pages config, and remove operators page if it is not supported
export const getPagesConfig = (
	network: NetworkId,
	category: number | null,
	advancedMode: boolean,
) => {
	const operatorsSupported = isOperatorsSupported(network)

	let pagesConfig = !operatorsSupported
		? PagesConfig.filter((page) => page.key === 'operators')
		: PagesConfig

	if (category) {
		pagesConfig = pagesConfig.filter((page) => page.category === category)
	}

	if (!advancedMode) {
		pagesConfig = pagesConfig.filter(({ advanced }) => !advanced)
	}
	return pagesConfig
}

// Get category id from category key
export const getCategoryId = (key: string | null) => {
	return PageCategories.find((page) => page.key === key)?.id || null
}

// Check whether a given page key exists in the category
export const pageKeyExistsInCategory = (
	pathname: string | null,
	category: number,
) => {
	if (!pathname || category === null) return false

	const categoryPages = PagesConfig.filter((page) => page.category === category)
	return categoryPages.some((page) => page.hash === pathname)
}
