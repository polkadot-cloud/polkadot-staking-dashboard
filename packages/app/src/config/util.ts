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
	stakingState?: {
		inPool: boolean
		isBonding: boolean
	},
) => {
	const operatorsSupported = isOperatorsSupported(network)

	// Filter out operators page if not supported on network
	let pagesConfig = !operatorsSupported
		? PagesConfig.filter((page) => page.key !== 'operators')
		: PagesConfig

	// Filter by category if specified
	if (category) {
		pagesConfig = pagesConfig.filter((page) => page.category === category)
	}

	// Filter out advanced pages if not in advanced mode
	if (!advancedMode) {
		pagesConfig = pagesConfig.filter(({ advanced }) => !advanced)
	}

	// In Simple mode, handle Stake vs Pools/Nominate pages
	if (!advancedMode) {
		const { inPool = false, isBonding = false } = stakingState || {}

		// If user is both in a pool AND bonding, show both separate pages (no Stake page) Otherwise,
		// show the unified Stake page and hide separate Pools/Nominate pages
		if (inPool && isBonding) {
			pagesConfig = pagesConfig.filter((page) => page.key !== 'stake')
		} else {
			pagesConfig = pagesConfig.filter(
				(page) => page.key !== 'pool' && page.key !== 'nominate',
			)
		}
	} else {
		// In Advanced mode, always hide the unified Stake page and show separate pages
		pagesConfig = pagesConfig.filter((page) => page.key !== 'stake')
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

	return PagesConfig.filter((page) => page.category === category).some(
		(page) => page.hash === pathname,
	)
}

// Get the category for a given page
export const getCategoryFromPage = (pathname: string | null) => {
	if (!pathname) return getFirstPageCategory().key

	const categoryId =
		PagesConfig.find((page) => page.key === pathname)?.category ||
		getFirstPageCategory().id

	return (
		PageCategories.find((category) => category.id === categoryId)?.key ||
		getFirstPageCategory().key
	)
}

// Gets the first page category
export const getFirstPageCategory = () => {
	return PageCategories[0]
}
