// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { withProviders } from '@w3ux/factories'
import {
  ExtensionsProvider,
  HardwareAccountsProvider,
} from '@w3ux/react-connect-kit'
import { DappName } from 'consts'
import { getNetworkData } from 'consts/util'
import { ActiveAccountsProvider } from 'contexts/ActiveAccounts'
import { APIProvider } from 'contexts/Api'
import { BalancesProvider } from 'contexts/Balances'
import { ExternalAccountsProvider } from 'contexts/Connect/ExternalAccounts'
import { ImportedAccountsProvider } from 'contexts/Connect/ImportedAccounts'
import { OtherAccountsProvider } from 'contexts/Connect/OtherAccounts'
import { CurrencyProvider } from 'contexts/Currency'
import { FastUnstakeProvider } from 'contexts/FastUnstake'
import { FiltersProvider } from 'contexts/Filters'
import { HelpProvider } from 'contexts/Help'
import { LedgerHardwareProvider } from 'contexts/LedgerHardware'
import { MenuProvider } from 'contexts/Menu'
import { MigrateProvider } from 'contexts/Migrate'
import { useNetwork } from 'contexts/Network'
import { OperatorsProvider } from 'contexts/Operators'
import { PayoutsProvider } from 'contexts/Payouts'
import { PluginsProvider } from 'contexts/Plugins'
import { ActivePoolProvider } from 'contexts/Pools/ActivePool'
import { BondedPoolsProvider } from 'contexts/Pools/BondedPools'
import { FavoritePoolsProvider } from 'contexts/Pools/FavoritePools'
import { PoolMembersProvider } from 'contexts/Pools/PoolMembers'
import { PromptProvider } from 'contexts/Prompt'
import { ProxiesProvider } from 'contexts/Proxies'
import { SetupProvider } from 'contexts/Setup'
import { StakingProvider } from 'contexts/Staking'
import { TokenPricesProvider } from 'contexts/TokenPrice'
import { TooltipProvider } from 'contexts/Tooltip'
import { TransferOptionsProvider } from 'contexts/TransferOptions'
import { TxMetaProvider } from 'contexts/TxMeta'
import { UIProvider } from 'contexts/UI'
import { FavoriteValidatorsProvider } from 'contexts/Validators/FavoriteValidators'
import { ValidatorsProvider } from 'contexts/Validators/ValidatorEntries'
import { WalletConnectProvider } from 'contexts/WalletConnect'
import { Tooltip } from 'radix-ui'
import { ThemedRouter } from 'Themes'
import { OverlayProvider } from 'ui-overlay'

export const Providers = () => {
  const { network } = useNetwork()
  const { ss58 } = getNetworkData(network)

  return withProviders(
    // !! Provider order matters.
    [
      ActiveAccountsProvider,
      UIProvider,
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
      OtherAccountsProvider,
      ImportedAccountsProvider,
      WalletConnectProvider,
      ProxiesProvider,
      HelpProvider,
      PluginsProvider,
      CurrencyProvider,
      TokenPricesProvider,
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
      SetupProvider,
      MenuProvider,
      TooltipProvider,
      TxMetaProvider,
      OverlayProvider,
      PromptProvider,
      MigrateProvider,
      FiltersProvider,
      OperatorsProvider,
      Tooltip.Provider,
    ],
    ThemedRouter
  )
}
