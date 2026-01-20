// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ThemedRouter } from 'Themes'
import { withProviders } from '@w3ux/factories'
import {
	ExtensionsProvider,
	HardwareAccountsProvider,
} from '@w3ux/react-connect-kit'
import { DappName } from 'consts'
import { getStakingChainData } from 'consts/util'
import { ActiveAccountsProvider } from 'contexts/ActiveAccounts'
import { ActiveStakerProvider } from 'contexts/ActiveStaker'
import { APIProvider } from 'contexts/Api'
import { BalancesProvider } from 'contexts/Balances'
import { ExternalAccountsProvider } from 'contexts/Connect/ExternalAccounts'
import { ImportedAccountsProvider } from 'contexts/Connect/ImportedAccounts'
import { CurrencyProvider } from 'contexts/Currency'
import { EraStakersProvider } from 'contexts/EraStakers'
import { FiltersProvider } from 'contexts/Filters'
import { HelpProvider } from 'contexts/Help'
import { InvitesProvider } from 'contexts/Invites'
import { LedgerHardwareProvider } from 'contexts/LedgerHardware'
import { MenuProvider } from 'contexts/Menu'
import { MigrateProvider } from 'contexts/Migrate'
import { useNetwork } from 'contexts/Network'
import { NominatorSetupsProvider } from 'contexts/NominatorSetups'
import { OperatorsProvider } from 'contexts/Operators'
import { PayoutsProvider } from 'contexts/Payouts'
import { PluginsProvider } from 'contexts/Plugins'
import { PoolSetupsProvider } from 'contexts/PoolSetups'
import { ActivePoolProvider } from 'contexts/Pools/ActivePool'
import { BondedPoolsProvider } from 'contexts/Pools/BondedPools'
import { FavoritePoolsProvider } from 'contexts/Pools/FavoritePools'
import { PoolMembersProvider } from 'contexts/Pools/PoolMembers'
import { PromptProvider } from 'contexts/Prompt'
import { ProxiesProvider } from 'contexts/Proxies'
import { StakingProvider } from 'contexts/Staking'
import { TokenPricesProvider } from 'contexts/TokenPrice'
import { TooltipProvider } from 'contexts/Tooltip'
import { TxMetaProvider } from 'contexts/TxMeta'
import { UIProvider } from 'contexts/UI'
import { FavoriteValidatorsProvider } from 'contexts/Validators/FavoriteValidators'
import { ValidatorsProvider } from 'contexts/Validators/ValidatorEntries'
import { Tooltip } from 'radix-ui'
import { OverlayProvider } from 'ui-overlay'

export const Providers = () => {
	const { network } = useNetwork()
	const { ss58 } = getStakingChainData(network)

	return withProviders(
		// !! Provider order matters.
		[
			ActiveAccountsProvider,
			UIProvider,
			OverlayProvider,
			[APIProvider, { network }],
			LedgerHardwareProvider,
			[
				ExtensionsProvider,

				{
					dappName: DappName,
					ss58,
				},
			],
			HardwareAccountsProvider,
			ExternalAccountsProvider,
			ImportedAccountsProvider,
			ProxiesProvider,
			HelpProvider,
			PluginsProvider,
			CurrencyProvider,
			TokenPricesProvider,
			BalancesProvider,
			EraStakersProvider,
			StakingProvider,
			FavoritePoolsProvider,
			BondedPoolsProvider,
			PoolMembersProvider,
			ActivePoolProvider,
			ValidatorsProvider,
			FavoriteValidatorsProvider,
			PayoutsProvider,
			PoolSetupsProvider,
			NominatorSetupsProvider,
			ActiveStakerProvider,
			MenuProvider,
			TooltipProvider,
			TxMetaProvider,
			PromptProvider,
			MigrateProvider,
			FiltersProvider,
			OperatorsProvider,
			InvitesProvider,
			Tooltip.Provider,
		],
		ThemedRouter,
	)
}
