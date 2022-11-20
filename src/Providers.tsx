// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TooltipProvider } from 'contexts/Tooltip';
import { TransferOptionsProvider } from 'contexts/TransferOptions';
import { TxFeesProvider } from 'contexts/TxFees';
import { withProviders } from 'library/Hooks';
import Router from 'Router';
import { ThemeProvider } from 'styled-components';
import { EntryWrapper as Wrapper } from 'Wrappers';
import { AccountProvider } from './contexts/Account';
import { APIProvider, useApi } from './contexts/Api';
import { BalancesProvider } from './contexts/Balances';
import { ConnectProvider } from './contexts/Connect';
import { ExtrinsicsProvider } from './contexts/Extrinsics';
import { HelpProvider } from './contexts/Help';
import { MenuProvider } from './contexts/Menu';
import { ModalProvider } from './contexts/Modal';
import { NetworkMetricsProvider } from './contexts/Network';
import { NotificationsProvider } from './contexts/Notifications';
import { OverlayProvider } from './contexts/Overlay';
import { ActivePoolsProvider } from './contexts/Pools/ActivePools';
import { BondedPoolsProvider } from './contexts/Pools/BondedPools';
import { PoolMembersProvider } from './contexts/Pools/PoolMembers';
import { PoolMembershipsProvider } from './contexts/Pools/PoolMemberships';
import { PoolsConfigProvider } from './contexts/Pools/PoolsConfig';
import { SessionEraProvider } from './contexts/SessionEra';
import { StakingProvider } from './contexts/Staking';
import { SubscanProvider } from './contexts/Subscan';
import { useTheme } from './contexts/Themes';
import { TipsProvider } from './contexts/Tips';
import { UIProvider } from './contexts/UI';
import { ValidatorsProvider } from './contexts/Validators';

// `polkadot-dashboard-ui` theme classes are inserted here.
export const WrappedRouter = () => {
  const { mode } = useTheme();
  const { network } = useApi();

  return (
    <Wrapper className={`theme-${network.name.toLowerCase()} theme-${mode}`}>
      <Router />
    </Wrapper>
  );
};

// App-specific theme classes are inserted here.
export const ThemedRouter = () => {
  const { mode } = useTheme();
  const { network } = useApi();

  return (
    <ThemeProvider
      theme={{ mode, card: 'shadow', network: `${network.name}-${mode}` }}
    >
      <WrappedRouter />
    </ThemeProvider>
  );
};

export const Providers = withProviders(
  APIProvider,
  ConnectProvider,
  HelpProvider,
  NetworkMetricsProvider,
  AccountProvider,
  BalancesProvider,
  StakingProvider,
  PoolsConfigProvider,
  BondedPoolsProvider,
  PoolMembershipsProvider,
  PoolMembersProvider,
  ActivePoolsProvider,
  TransferOptionsProvider,
  ValidatorsProvider,
  UIProvider,
  SubscanProvider,
  MenuProvider,
  TooltipProvider,
  NotificationsProvider,
  TxFeesProvider,
  ExtrinsicsProvider,
  ModalProvider,
  SessionEraProvider,
  TipsProvider,
  OverlayProvider
)(ThemedRouter);

export default Providers;
