// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BalancesProvider } from 'contexts/Balances';
import { BondedProvider } from 'contexts/Bonded';
import {
  ExtensionsProvider,
  ExtensionAccountsProvider,
  OverlayProvider,
} from '@polkadot-cloud/react/providers';
import { ExtrinsicsProvider } from 'contexts/Extrinsics';
import { FastUnstakeProvider } from 'contexts/FastUnstake';
import { FiltersProvider } from 'contexts/Filters';
import { LedgerHardwareProvider } from 'contexts/Hardware/Ledger/LedgerHardware';
import { VaultAccountsProvider } from 'contexts/Hardware/Vault/VaultAccounts';
import { HelpProvider } from 'contexts/Help';
import { IdentitiesProvider } from 'contexts/Identities';
import { MenuProvider } from 'contexts/Menu';
import { MigrateProvider } from 'contexts/Migrate';
import { NetworkMetricsProvider } from 'contexts/NetworkMetrics';
import { NotificationsProvider } from 'contexts/Notifications';
import { PromptProvider } from 'contexts/Prompt';
import { PluginsProvider } from 'contexts/Plugins';
import { ActivePoolsProvider } from 'contexts/Pools/ActivePools';
import { BondedPoolsProvider } from 'contexts/Pools/BondedPools';
import { PoolMembersProvider } from 'contexts/Pools/PoolMembers';
import { PoolMembershipsProvider } from 'contexts/Pools/PoolMemberships';
import { PoolsConfigProvider } from 'contexts/Pools/PoolsConfig';
import { ProxiesProvider } from 'contexts/Proxies';
import { SetupProvider } from 'contexts/Setup';
import { StakingProvider } from 'contexts/Staking';
import { SubscanProvider } from 'contexts/Plugins/Subscan';
import { TooltipProvider } from 'contexts/Tooltip';
import { TransferOptionsProvider } from 'contexts/TransferOptions';
import { TxMetaProvider } from 'contexts/TxMeta';
import { UIProvider } from 'contexts/UI';
import { ValidatorsProvider } from 'contexts/Validators/ValidatorEntries';
import { FavoriteValidatorsProvider } from 'contexts/Validators/FavoriteValidators';
import { PayoutsProvider } from 'contexts/Payouts';
import { PolkawatchProvider } from 'contexts/Plugins/Polkawatch';
import { useNetwork } from 'contexts/Network';
import { APIProvider } from 'contexts/Api';
import { ThemedRouter } from 'Themes';
import type { AnyJson } from 'types';
import type { FC } from 'react';
import { withProviders } from 'library/Hooks';
import { OtherAccountsProvider } from 'contexts/Connect/OtherAccounts';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { DappName } from 'consts';
import { ImportedAccountsProvider } from 'contexts/Connect/ImportedAccounts';
import { PoolPerformanceProvider } from 'contexts/Pools/PoolPerformance';
import { LedgerAccountsProvider } from 'contexts/Hardware/Ledger/LedgerAccounts';
import { ExternalAccountsProvider } from 'contexts/Connect/ExternalAccounts';

// Embed providers from hook.
export const Providers = () => {
  const {
    network,
    networkData: { ss58 },
  } = useNetwork();
  const { activeAccount, setActiveAccount } = useActiveAccounts();

  // !! Provider order matters
  const providers: Array<FC<AnyJson> | [FC<AnyJson>, AnyJson]> = [
    [APIProvider, { network }],
    FiltersProvider,
    NotificationsProvider,
    PluginsProvider,
    VaultAccountsProvider,
    LedgerHardwareProvider,
    ExtensionsProvider,
    [
      ExtensionAccountsProvider,
      { dappName: DappName, network, ss58, activeAccount, setActiveAccount },
    ],
    LedgerAccountsProvider,
    ExternalAccountsProvider,
    OtherAccountsProvider,
    ImportedAccountsProvider,
    ProxiesProvider,
    NetworkMetricsProvider,
    HelpProvider,
    SubscanProvider,
    PolkawatchProvider,
    IdentitiesProvider,
    BalancesProvider,
    BondedProvider,
    StakingProvider,
    PoolsConfigProvider,
    BondedPoolsProvider,
    PoolMembershipsProvider,
    PoolMembersProvider,
    ActivePoolsProvider,
    TransferOptionsProvider,
    ValidatorsProvider,
    FavoriteValidatorsProvider,
    FastUnstakeProvider,
    PayoutsProvider,
    PoolPerformanceProvider,
    UIProvider,
    SetupProvider,
    MenuProvider,
    TooltipProvider,
    TxMetaProvider,
    ExtrinsicsProvider,
    OverlayProvider,
    PromptProvider,
    MigrateProvider,
  ];

  return <>{withProviders(providers, ThemedRouter)}</>;
};
