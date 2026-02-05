// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWarnings } from 'library/PageWarnings'
import { Stats } from 'library/Stats'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { PoolOverview } from './Overview'
import { usePoolsStats } from '../../hooks/usePoolStats'

export const Pools = () => {
	const { t } = useTranslation('pages')
	const poolsStats = usePoolsStats()

	return (
		<>
			<Page.Title title={t('pool', { ns: 'app' })}></Page.Title>
			<PageWarnings />
			<Stat.Row>
				<Stats items={poolsStats} />
			</Stat.Row>
			<PoolOverview />
		</>
	)
}
