// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BalancesProvider } from 'contexts/Balances';
import { BondedProvider } from 'contexts/Bonded';
import {
  ExtensionsProvider,
  ExtensionAccountsProvider,
  LedgerAccountsProvider,
  VaultAccountsProvider,
  WCAccountsProvider,
} from '@w3ux/react-connect-kit';
import { FastUnstakeProvider } from 'contexts/FastUnstake';
import { FiltersProvider } from 'contexts/Filters';
import { LedgerHardwareProvider } from 'contexts/LedgerHardware';
import { HelpProvider } from 'contexts/Help';
import { MenuProvider } from 'contexts/Menu';
import { MigrateProvider } from 'contexts/Migrate';
import { PromptProvider } from 'contexts/Prompt';
import { PluginsProvider } from 'contexts/Plugins';
import { ActivePoolProvider } from 'contexts/Pools/ActivePool';
import { BondedPoolsProvider } from 'contexts/Pools/BondedPools';
import { PoolMembersProvider } from 'contexts/Pools/PoolMembers';
import { FavoritePoolsProvider } from 'contexts/Pools/FavoritePools';
import { ProxiesProvider } from 'contexts/Proxies';
import { SetupProvider } from 'contexts/Setup';
import { StakingProvider } from 'contexts/Staking';
import { TooltipProvider } from 'contexts/Tooltip';
import { TransferOptionsProvider } from 'contexts/TransferOptions';
import { TxMetaProvider } from 'contexts/TxMeta';
import { UIProvider } from 'contexts/UI';
import { ValidatorsProvider } from 'contexts/Validators/ValidatorEntries';
import { FavoriteValidatorsProvider } from 'contexts/Validators/FavoriteValidators';
import { PayoutsProvider } from 'contexts/Payouts';
import { useNetwork } from 'contexts/Network';
import { APIProvider } from 'contexts/Api';
import { ThemedRouter } from 'Themes';
import { OtherAccountsProvider } from 'contexts/Connect/OtherAccounts';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { DappName } from 'consts';
import { ImportedAccountsProvider } from 'contexts/Connect/ImportedAccounts';
import { PoolPerformanceProvider } from 'contexts/Pools/PoolPerformance';
import { ExternalAccountsProvider } from 'contexts/Connect/ExternalAccounts';
import { withProviders } from '@w3ux/factories';
import { CommunityProvider } from 'contexts/Community';
import { OverlayProvider } from 'kits/Overlay/Provider';
import { JoinPoolsProvider } from 'contexts/Pools/JoinPools';
import { WalletConnectProvider } from 'contexts/WalletConnect';

export const Providers = () => {
  const { network } = useNetwork();
  const { activeAccount, setActiveAccount } = useActiveAccounts();

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
        { dappName: DappName, network, activeAccount, setActiveAccount },
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
  );
};
