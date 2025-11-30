// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { WithdrawPrompt } from 'library/WithdrawPrompt'
import { ManageBond } from 'pages/Pools/ManageBond'
import { Status } from 'pages/Pools/Status'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { AverageRewardRate } from './Stats/AverageRewardRate'
import { MinJoinBond } from './Stats/MinJoinBond'
import { NextRewards } from './Stats/NextRewards'

export const Stake = () => {
	const { t } = useTranslation('pages')

	const ROW_HEIGHT = 220

	return (
		<>
			<Page.Title title={t('stake')} />
			<Stat.Row>
				<AverageRewardRate />
				<MinJoinBond />
				<NextRewards />
			</Stat.Row>
			<WithdrawPrompt bondFor="pool" />
			<Page.Row>
				<Page.RowSection secondary vLast>
					<CardWrapper height={ROW_HEIGHT}>
						<ManageBond />
					</CardWrapper>
				</Page.RowSection>
				<Page.RowSection hLast>
					<Status height={ROW_HEIGHT} />
				</Page.RowSection>
			</Page.Row>
		</>
	)
}
