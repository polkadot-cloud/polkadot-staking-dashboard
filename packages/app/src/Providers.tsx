// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { withProviders } from '@w3ux/factories'
import {
  ExtensionAccountsProvider,
  ExtensionsProvider,
  LedgerAccountsProvider,
  VaultAccountsProvider,
  WCAccountsProvider,
} from '@w3ux/react-connect-kit'
import { DappName } from 'consts'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { APIProvider } from 'contexts/Api'
import { BalancesProvider } from 'contexts/Balances'
import { BondedProvider } from 'contexts/Bonded'
import { CommunityProvider } from 'contexts/Community'
import { ExternalAccountsProvider } from 'contexts/Connect/ExternalAccounts'
import { ImportedAccountsProvider } from 'contexts/Connect/ImportedAccounts'
import { OtherAccountsProvider } from 'contexts/Connect/OtherAccounts'
import { FastUnstakeProvider } from 'contexts/FastUnstake'
import { FiltersProvider } from 'contexts/Filters'
import { HelpProvider } from 'contexts/Help'
import { LedgerHardwareProvider } from 'contexts/LedgerHardware'
import { MenuProvider } from 'contexts/Menu'
import { MigrateProvider } from 'contexts/Migrate'
import { useNetwork } from 'contexts/Network'
import { PayoutsProvider } from 'contexts/Payouts'
import { PluginsProvider } from 'contexts/Plugins'
import { ActivePoolProvider } from 'contexts/Pools/ActivePool'
import { BondedPoolsProvider } from 'contexts/Pools/BondedPools'
import { FavoritePoolsProvider } from 'contexts/Pools/FavoritePools'
import { JoinPoolsProvider } from 'contexts/Pools/JoinPools'
import { PoolMembersProvider } from 'contexts/Pools/PoolMembers'
import { PoolPerformanceProvider } from 'contexts/Pools/PoolPerformance'
import { PromptProvider } from 'contexts/Prompt'
import { ProxiesProvider } from 'contexts/Proxies'
import { SetupProvider } from 'contexts/Setup'
import { StakingProvider } from 'contexts/Staking'
import { TooltipProvider } from 'contexts/Tooltip'
import { TransferOptionsProvider } from 'contexts/TransferOptions'
import { TxMetaProvider } from 'contexts/TxMeta'
import { UIProvider } from 'contexts/UI'
import { FavoriteValidatorsProvider } from 'contexts/Validators/FavoriteValidators'
import { ValidatorsProvider } from 'contexts/Validators/ValidatorEntries'
import { WalletConnectProvider } from 'contexts/WalletConnect'
import { OverlayProvider } from 'kits/Overlay/Provider'
import { ThemedRouter } from 'Themes'
import { registerSaEvent } from 'utils'

export const Providers = () => {
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()
  const { activeAccount, setActiveAccount } = useActiveAccounts()

  return withProviders(
    // !! Provider order matters.
    [
      UIProvider,
      [APIProvider, { network }],
      LedgerHardwareProvider,
      [
        ExtensionsProvider,
        { options: { chainSafeSnapEnabled: true, polkagateSnapEnabled: true } },
      ],
      [
        ExtensionAccountsProvider,

        {
          dappName: DappName,
          network,
          ss58,
          activeAccount,
          setActiveAccount,
          onExtensionEnabled: (id: string) => {
            registerSaEvent(`${network.toLowerCase()}_extension_connected`, {
              id,
            })
          },
        },
      ],
      WCAccountsProvider,
      VaultAccountsProvider,
      LedgerAccountsProvider,
      ExternalAccountsProvider,
      OtherAccountsProvider,
      ImportedAccountsProvider,
      WalletConnectProvider,
      ProxiesProvider,
      HelpProvider,
      PluginsProvider,
      BondedProvider,
      BalancesProvider,
      StakingProvider,
      FavoritePoolsProvider,
      BondedPoolsProvider,
      PoolMembersProvider,
      ActivePoolProvider,
      TransferOptionsProvider,
      ValidatorsProvider,
      FavoriteValidatorsProvider,
      FastUnstakeProvider,
      PayoutsProvider,
      PoolPerformanceProvider,
      JoinPoolsProvider,
      SetupProvider,
      MenuProvider,
      TooltipProvider,
      TxMetaProvider,
      OverlayProvider,
      PromptProvider,
      MigrateProvider,
      FiltersProvider,
      CommunityProvider,
    ],
    ThemedRouter
  )
}
