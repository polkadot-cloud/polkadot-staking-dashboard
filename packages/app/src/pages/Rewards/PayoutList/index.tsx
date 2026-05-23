// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount } from '@polkadot-cloud/connect'
import { MaxPayoutDays } from 'consts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { getUnixTime, startOfToday, subDays } from 'date-fns'
import { CardWrapper } from 'library/Card/Wrappers'
import { fetchPoolRewards, fetchRewards } from 'plugin-staking-api'
import type { RewardResults } from 'plugin-staking-api/types'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import type { RewardsKind } from '../types'
import { Inner } from './Inner'

const ITEMS_PER_PAGE = 50
const MAX_PAGES = 5

interface PaginatedPayoutsProps {
	kind: RewardsKind
}

interface PayoutPage {
	payouts: RewardResults
	hasNext: boolean
}

// Renders a paginated list of payouts for a single source (nominator or pool). Each page is fetched
// on demand from the staking API and cached so that navigating between previously-loaded pages does
// not re-fetch.
export const PaginatedPayouts = ({ kind }: PaginatedPayoutsProps) => {
	const { t } = useTranslation('pages')
	const { activeEra } = useApi()
	const { network } = useNetwork()
	const { pluginEnabled } = usePlugins()
	const { activeAddress } = useActiveAccount()

	const apiEnabled = pluginEnabled('staking_api')

	// Current page (1-indexed)
	const [page, setPage] = useState<number>(1)

	// Cache of fetched pages, keyed by page number
	const [pages, setPages] = useState<Record<number, PayoutPage>>({})

	// Whether the current page request is in flight
	const [loading, setLoading] = useState<boolean>(false)

	// Reset cache + page state when the underlying source changes
	useEffect(() => {
		setPage(1)
		setPages({})
	}, [network, activeAddress, kind, apiEnabled])

	const fetchPage = useCallback(
		async (targetPage: number): Promise<PayoutPage> => {
			const offset = (targetPage - 1) * ITEMS_PER_PAGE
			let payouts: RewardResults
			if (kind === 'nominator') {
				const { allRewards } = await fetchRewards(
					network,
					activeAddress || '',
					Math.max(activeEra.index - 1, 0),
					ITEMS_PER_PAGE,
					offset,
				)
				payouts = allRewards as RewardResults
			} else {
				const fromDate = subDays(startOfToday(), MaxPayoutDays)
				const { poolRewards } = await fetchPoolRewards(
					network,
					activeAddress || '',
					getUnixTime(fromDate),
					ITEMS_PER_PAGE,
					offset,
				)
				payouts = poolRewards as RewardResults
			}

			return {
				payouts,
				hasNext: payouts.length === ITEMS_PER_PAGE && targetPage < MAX_PAGES,
			}
		},
		[network, activeAddress, activeEra.index, kind],
	)

	// Fetch the current page on demand (cache miss)
	useEffect(() => {
		if (!apiEnabled || !activeAddress || activeEra.index <= 0) {
			return
		}
		if (pages[page] !== undefined) {
			return
		}
		let cancelled = false
		setLoading(true)
		fetchPage(page)
			.then((data) => {
				if (cancelled) {
					return
				}
				setPages((prev) => ({ ...prev, [page]: data }))
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false)
				}
			})
		return () => {
			cancelled = true
		}
	}, [page, pages, apiEnabled, activeAddress, activeEra.index, fetchPage])

	const pageData = pages[page]
	const payouts = pageData?.payouts ?? []

	const titleKey = kind === 'nominator' ? 'payouts' : 'poolClaim'

	return (
		<Page.Row>
			<CardWrapper>
				<Inner
					title={t(titleKey, { ns: 'app' })}
					payouts={payouts}
					pagination
					itemsPerPage={ITEMS_PER_PAGE}
					loading={loading}
					remotePagination={{
						page,
						setPage,
						hasNext: pageData?.hasNext ?? false,
					}}
				/>
			</CardWrapper>
		</Page.Row>
	)
}

// Convenience wrappers for the two reward sources
export const NominatorPayouts = () => <PaginatedPayouts kind="nominator" />
export const PoolPayouts = () => <PaginatedPayouts kind="pool" />
