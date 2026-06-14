// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ThemedRouter } from 'Themes'
import { ConnectProvider } from '@polkadot-cloud/connect'
import { LedgerAdaptor } from '@polkadot-cloud/connect-ledger'
import { createProxiesAdaptor } from '@polkadot-cloud/connect-proxies'
import { withProviders } from '@w3ux/factories'
import { DappName } from 'consts'
import { getStakingChainData } from 'consts/util'
import { ActiveStakerProvider } from 'contexts/ActiveStaker'
import { EraStakersProvider } from 'contexts/EraStakers'
import { FiltersProvider } from 'contexts/Filters'
import { HelpProvider } from 'contexts/Help'
import { MenuProvider } from 'contexts/Menu'
import { MigrateProvider } from 'contexts/Migrate'
import { NominatorSetupsProvider } from 'contexts/NominatorSetups'
import { OperatorsProvider } from 'contexts/Operators'
import { BondedPoolsProvider } from 'contexts/Pools/BondedPools'
import { PoolMembersProvider } from 'contexts/Pools/PoolMembers'
import { PromptProvider } from 'contexts/Prompt'
import { TooltipProvider } from 'contexts/Tooltip'
import { UIProvider } from 'contexts/UI'
import { ValidatorsProvider } from 'contexts/Validators/ValidatorEntries'
import { useNetwork } from 'hooks/useNetwork'
import { Tooltip } from 'radix-ui'
import { OverlayProvider } from 'ui-overlay'

export const Providers = () => {
	const { network } = useNetwork()
	const { ss58 } = getStakingChainData(network)

	return withProviders(
		// !! Provider order matters.
		[
			UIProvider,
			OverlayProvider,
			[
				ConnectProvider,
				{
					network,
					dappName: DappName,
					ss58,
					adaptors: [LedgerAdaptor, createProxiesAdaptor(network)],
				},
			],
			HelpProvider,
			EraStakersProvider,
			BondedPoolsProvider,
			PoolMembersProvider,
			ValidatorsProvider,
			NominatorSetupsProvider,
			ActiveStakerProvider,
			MenuProvider,
			TooltipProvider,
			PromptProvider,
			MigrateProvider,
			FiltersProvider,
			OperatorsProvider,
			Tooltip.Provider,
		],
		ThemedRouter,
	)
}
