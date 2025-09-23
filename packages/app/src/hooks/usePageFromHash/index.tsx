// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getCategoryFromPage } from 'config/util'
import { useLocation } from 'react-router-dom'

export const usePageFromHash = () => {
	const { pathname } = useLocation()
	const page = (pathname ?? '').replace(/^#?\/+/, '').split('?')[0]

	const categoryKey = getCategoryFromPage(page)

	return { page, categoryKey }
}
