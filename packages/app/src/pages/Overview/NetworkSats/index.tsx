// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { Header } from 'library/Announcements/Header'
import { Wrapper } from 'library/Announcements/Wrappers'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { CardHeader } from 'ui-core/base'
import { Announcements } from './Announcements'

export const NetworkStats = () => {
	const { t } = useTranslation()
	const { bondedPools } = useBondedPools()
	const {
		poolsConfig: { counterForPoolMembers },
	} = useApi()
	const { counterForNominators, counterForValidators } = useApi().stakingMetrics

	const items = [
		{
			label: t('totalValidators', { ns: 'pages' }),
			value: new BigNumber(counterForValidators).toFormat(0),
			helpKey: 'Validator',
		},
		{
			label: t('totalNominators', { ns: 'pages' }),
			value: new BigNumber(counterForNominators).toFormat(0),
			helpKey: 'Total Nominators',
		},
		{
			label: t('activePools', { ns: 'pages' }),
			value: new BigNumber(bondedPools.length).toFormat(),
			helpKey: 'Active Pools',
		},
		{
			label: t('poolMembers', { ns: 'modals' }),
			value: `${new BigNumber(counterForPoolMembers).toFormat()}`,
			helpKey: 'Nomination Pools',
		},
	]

	return (
		<CardWrapper style={{ boxShadow: 'var(--shadow-alt)' }}>
			<CardHeader margin>
				<h3>{t('networkStats', { ns: 'pages' })}</h3>
			</CardHeader>
			<Wrapper>
				<Header items={items} />
				<Announcements />
			</Wrapper>
		</CardWrapper>
	)
}
