// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ThemedRouter } from 'Themes';
import { APIProvider } from 'contexts/Api';
import { BalancesProvider } from 'contexts/Balances';
import { BondedProvider } from 'contexts/Bonded';
import { ConnectProvider } from 'contexts/Connect';
import { ExtensionsProvider } from 'contexts/Extensions';
import { ExtrinsicsProvider } from 'contexts/Extrinsics';
import { FastUnstakeProvider } from 'contexts/FastUnstake';
import { FiltersProvider } from 'contexts/Filters';
import { LedgerHardwareProvider } from 'contexts/Hardware/Ledger';
import { VaultHardwareProvider } from 'contexts/Hardware/Vault';
import { HelpProvider } from 'contexts/Help';
import { IdentitiesProvider } from 'contexts/Identities';
import { MenuProvider } from 'contexts/Menu';
import { MigrateProvider } from 'contexts/Migrate';
import { NetworkMetricsProvider } from 'contexts/Network';
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
import { SubscanProvider } from 'contexts/Subscan';
import { TooltipProvider } from 'contexts/Tooltip';
import { TransferOptionsProvider } from 'contexts/TransferOptions';
import { TxMetaProvider } from 'contexts/TxMeta';
import { UIProvider } from 'contexts/UI';
import { ValidatorsProvider } from 'contexts/Validators';
import { withProviders } from 'library/Hooks';
import { OverlayProvider } from 'contexts/Overlay';

// !! Provider order matters.
export const Providers = withProviders(
  FiltersProvider,
  NotificationsProvider,
  APIProvider,
  VaultHardwareProvider,
  LedgerHardwareProvider,
  ExtensionsProvider,
  ConnectProvider,
  HelpProvider,
  NetworkMetricsProvider,
  IdentitiesProvider,
  ProxiesProvider,
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
  FastUnstakeProvider,
  UIProvider,
  PluginsProvider,
  SetupProvider,
  SubscanProvider,
  MenuProvider,
  TooltipProvider,
  TxMetaProvider,
  ExtrinsicsProvider,
  OverlayProvider,
  PromptProvider,
  MigrateProvider
)(ThemedRouter);
