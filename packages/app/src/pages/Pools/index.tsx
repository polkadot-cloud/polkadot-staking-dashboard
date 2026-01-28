// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWarnings } from 'library/PageWarnings'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { PoolOverview } from './Overview'
import { ActivePoolCount } from './Stats/ActivePoolCount'
import { MinCreateBond } from './Stats/MinCreateBond'
import { MinJoinBond } from './Stats/MinJoinBond'

export const Pools = () => {
	const { t } = useTranslation('pages')

	return (
		<>
			<Page.Title title={t('pool', { ns: 'app' })}></Page.Title>
			<PageWarnings />
			<Stat.Row>
				<ActivePoolCount />
				<MinJoinBond />
				<MinCreateBond />
			</Stat.Row>
			<PoolOverview />
		</>
	)
}
