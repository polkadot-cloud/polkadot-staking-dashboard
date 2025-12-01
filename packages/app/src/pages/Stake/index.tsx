// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AverageRewardRate } from 'pages/Overview/Stats/AverageRewardRate'
import { NextRewards } from 'pages/Overview/Stats/NextRewards'
import { PoolOverview } from 'pages/Pools/Overview'
import { MinJoinBond } from 'pages/Pools/Stats/MinJoinBond'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'

export const Stake = () => {
	const { t } = useTranslation('pages')

	return (
		<>
			<Page.Title title={t('stake')} />
			<Stat.Row>
				<AverageRewardRate />
				<MinJoinBond />
				<NextRewards />
			</Stat.Row>
			<PoolOverview />
		</>
	)
}
