// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Entry } from '@polkadotcloud/core-ui';
import { Router } from 'Router';
import { AccountBalancesProvider } from 'contexts/AccountBalances';
import { APIProvider, useApi } from 'contexts/Api';
import { BalancesProvider } from 'contexts/Balances';
import { ConnectProvider } from 'contexts/Connect';
import { ExtensionsProvider } from 'contexts/Extensions';
import { ExtrinsicsProvider } from 'contexts/Extrinsics';
import { FastUnstakeProvider } from 'contexts/FastUnstake';
import { FiltersProvider } from 'contexts/Filters';
import { LedgerHardwareProvider } from 'contexts/Hardware/Ledger';
import { HelpProvider } from 'contexts/Help';
import { IdentitiesProvider } from 'contexts/Identities';
import { MenuProvider } from 'contexts/Menu';
import { MigrateProvider } from 'contexts/Migrate';
import { ModalProvider } from 'contexts/Modal';
import { NetworkMetricsProvider } from 'contexts/Network';
import { NotificationsProvider } from 'contexts/Notifications';
import { OverlayProvider } from 'contexts/Overlay';
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
import { useTheme } from 'contexts/Themes';
import { TooltipProvider } from 'contexts/Tooltip';
import { TransferOptionsProvider } from 'contexts/TransferOptions';
import { TxMetaProvider } from 'contexts/TxMeta';
import { UIProvider } from 'contexts/UI';
import { ValidatorsProvider } from 'contexts/Validators';
import { withProviders } from 'library/Hooks';
import { ThemeProvider } from 'styled-components';

// App theme classes and `@polkadotcloud/core-ui` theme classes are inserted here.
export const ThemedRouter = () => {
  const { mode } = useTheme();
  const { network } = useApi();

  return (
    <ThemeProvider theme={{ mode, network: `${network.name}-${mode}` }}>
      <Entry mode={mode} network={network.name}>
        <Router />
      </Entry>
    </ThemeProvider>
  );
};

export const Providers = withProviders(
  FiltersProvider,
  APIProvider,
  LedgerHardwareProvider,
  ExtensionsProvider,
  ConnectProvider,
  HelpProvider,
  NetworkMetricsProvider,
  IdentitiesProvider,
  ProxiesProvider,
  AccountBalancesProvider,
  BalancesProvider,
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
  NotificationsProvider,
  TxMetaProvider,
  ExtrinsicsProvider,
  ModalProvider,
  OverlayProvider,
  MigrateProvider
)(ThemedRouter);
