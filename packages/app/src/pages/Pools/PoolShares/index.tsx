// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount } from '@polkadot-cloud/connect'
import { PoolSharesDays } from 'consts'
import { PolkadotKnownPoolIds } from 'consts/pools'
import { getStakingChainData, isPoolShareEnabled } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useThemeValues } from 'contexts/ThemeValues'
import { getUnixTime } from 'date-fns'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { StatusLabel } from 'library/StatusLabel'
import { DefaultLocale, locales } from 'locales'
import { fetchCombinedPoolRewards, isPoolShareReward } from 'plugin-staking-api'
import type { CombinedPoolReward } from 'plugin-staking-api/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader, Page } from 'ui-core/base'
import { GraphWrapper, PoolSharesBar } from 'ui-graphs'
import { startOfUTCDay, subUTCDays } from 'utils'

const POOL_SHARE_FETCH_LIMIT = 100
const MAX_POOL_SHARE_FETCH_PAGES = 5

export const PoolShares = () => {
	const { i18n, t } = useTranslation()
	const { network } = useNetwork()
	const { pluginEnabled } = usePlugins()
	const { activePool } = useActivePool()
	const { getThemeValue } = useThemeValues()
	const { activeAddress } = useActiveAccount()
	const { syncing: syncingInitialization } = useSyncing(['initialization'])
	const { unit, units } = getStakingChainData(network)
	const [loading, setLoading] = useState<boolean>(false)
	const [poolShareRewards, setPoolShareRewards] = useState<
		CombinedPoolReward[]
	>([])
	const [poolClaimRewards, setPoolClaimRewards] = useState<
		CombinedPoolReward[]
	>([])

	const stakingApiEnabled = pluginEnabled('staking_api')
	const poolShareEnabled = isPoolShareEnabled(network, activePool?.id)
	const graphActive =
		!syncingInitialization &&
		stakingApiEnabled &&
		poolShareEnabled &&
		!!activeAddress

	useEffect(() => {
		if (!graphActive) {
			setPoolShareRewards([])
			setPoolClaimRewards([])
			setLoading(false)
			return
		}

		const fromTimestamp = getUnixTime(
			subUTCDays(startOfUTCDay(new Date()), PoolSharesDays - 1),
		)

		let cancelled = false
		const fetchPoolShares = async () => {
			setLoading(true)
			setPoolShareRewards([])
			setPoolClaimRewards([])
			const shareRewards: CombinedPoolReward[] = []
			const claimRewards: CombinedPoolReward[] = []
			let after: string | undefined

			for (let page = 0; page < MAX_POOL_SHARE_FETCH_PAGES; page++) {
				const {
					combinedPoolRewards: { entries, hasNextPage, nextCursor },
				} = await fetchCombinedPoolRewards(
					network,
					activeAddress || '',
					POOL_SHARE_FETCH_LIMIT,
					after,
				)

				shareRewards.push(...entries.filter(isPoolShareReward))
				claimRewards.push(
					...entries.filter((entry) => !isPoolShareReward(entry)),
				)

				if (
					!hasNextPage ||
					!nextCursor ||
					entries.some(({ timestamp }) => timestamp < fromTimestamp)
				) {
					break
				}
				after = nextCursor
			}

			if (!cancelled) {
				setPoolShareRewards(shareRewards)
				setPoolClaimRewards(claimRewards)
				setLoading(false)
			}
		}

		fetchPoolShares()

		return () => {
			cancelled = true
		}
	}, [graphActive, network, activeAddress])

	const poolIds = PolkadotKnownPoolIds.join(' and ')

	return (
		<Page.Row>
			<CardWrapper>
				<CardHeader margin>
					<h3>Reward Trend</h3>
				</CardHeader>
				<div className="inner" style={{ minHeight: '205px' }}>
					{!stakingApiEnabled && (
						<StatusLabel
							status="active_service"
							statusFor="staking_api"
							title={t('stakingApiDisabled', { ns: 'pages' })}
							topOffset="38%"
						/>
					)}
					{stakingApiEnabled && !poolShareEnabled && !syncingInitialization && (
						<StatusLabel
							status="pool_share_unavailable"
							title={`Pool share analytics are only available for Polkadot Cloud pools ${poolIds}.`}
							topOffset="38%"
						/>
					)}
					<GraphWrapper
						style={{
							height: '175px',
							position: 'absolute',
							opacity: graphActive ? 1 : 0.55,
							transition: 'opacity 0.5s',
						}}
					>
						<PoolSharesBar
							days={PoolSharesDays}
							entries={graphActive ? poolShareRewards : []}
							claimedEntries={graphActive ? poolClaimRewards : []}
							syncing={syncingInitialization || (graphActive && loading)}
							height="175px"
							getThemeValue={getThemeValue}
							unit={unit}
							units={units}
							dateFormat={
								locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
							}
							labels={{
								poolShares: t('share', { ns: 'app' }),
								claim: t('claim', { ns: 'modals' }),
								claimed: 'Claimed',
							}}
						/>
					</GraphWrapper>
				</div>
			</CardWrapper>
		</Page.Row>
	)
}
