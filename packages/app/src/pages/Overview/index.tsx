// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { BalanceChart } from './AccountBalance/BalanceChart'
import { BalanceLinks } from './AccountBalance/BalanceLinks'
import { ControllerPrompt } from './ControllerPrompt'
import { NetworkStats } from './NetworkSats'
import { Payouts } from './Payouts'
import { QuickActions } from './QuickActions'
import { AverageRewardRate } from './Stats/AverageRewardRate'
import { NextRewards } from './Stats/NextRewards'
import { SupplyStaked } from './Stats/SupplyStaked'
import { Summaries } from './Summaries'

export const Overview = () => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { isBonding } = useStaking()
	const { pluginEnabled } = usePlugins()
	const { getStakingLedger } = useBalances()
	const { activeAddress } = useActiveAccounts()
	const { syncing, accountSynced } = useSyncing()
	const { isReadOnlyAccount } = useImportedAccounts()

	const { controllerUnmigrated } = getStakingLedger(activeAddress)

	// Fiat values result in a slightly larger height for Balance & Payouts
	const showFiat = pluginEnabled('staking_api') && network !== 'westend'

	const STATUS_HEIGHT = 220
	const PAYOUTS_HEIGHT = showFiat ? 385 : 380

	return (
		<>
			<Page.Title title={t('overview')} />
			<Stat.Row>
				<AverageRewardRate />
				<SupplyStaked />
				<NextRewards />
			</Stat.Row>
			{isBonding &&
				!syncing &&
				accountSynced(activeAddress) &&
				controllerUnmigrated &&
				!isReadOnlyAccount(activeAddress) && <ControllerPrompt />}
			<Page.Row>
				<Page.RowSection>
					<Summaries height={STATUS_HEIGHT} />
				</Page.RowSection>
				<Page.RowSection secondary hLast vLast>
					<QuickActions height={STATUS_HEIGHT} />
				</Page.RowSection>
			</Page.Row>
			<Page.Row>
				<Page.RowSection secondary>
					<CardWrapper height={PAYOUTS_HEIGHT}>
						<BalanceChart />
						<BalanceLinks />
					</CardWrapper>
				</Page.RowSection>
				<Page.RowSection hLast vLast>
					<CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }}>
						<Payouts />
					</CardWrapper>
				</Page.RowSection>
			</Page.Row>
			<Page.Row>
				<NetworkStats />
			</Page.Row>
		</>
	)
}
