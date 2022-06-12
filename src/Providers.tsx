// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProvider } from 'styled-components';
import { EntryWrapper as Wrapper } from 'Wrappers';
import Router from 'Router';
import { withProviders } from 'library/Hooks';
import { AccountProvider } from './contexts/Account';
import { APIProvider } from './contexts/Api';
import { AssistantProvider } from './contexts/Assistant';
import { BalancesProvider } from './contexts/Balances';
import { ConnectProvider } from './contexts/Connect';
import { ExtrinsicsProvider } from './contexts/Extrinsics';
import { MenuProvider } from './contexts/Menu';
import { MessagesProvider } from './contexts/Messages';
import { ModalProvider } from './contexts/Modal';
import { NetworkMetricsProvider } from './contexts/Network';
import { NotificationsProvider } from './contexts/Notifications';
import { PoolsConfigProvider } from './contexts/Pools/PoolsConfig';
import { BondedPoolsProvider } from './contexts/Pools/BondedPools';
import { PoolMembershipsProvider } from './contexts/Pools/PoolMemberships';
import { ActivePoolProvider } from './contexts/Pools/ActivePool';
import { SideBarProvider } from './contexts/SideBar';
import { StakingProvider } from './contexts/Staking';
import { SubscanProvider } from './contexts/Subscan';
import { ValidatorsProvider } from './contexts/Validators';
import { UIProvider } from './contexts/UI';
import { useTheme } from './contexts/Themes';
import { SessionEraProvider } from './contexts/SessionEra';

export const WrappedRouter = () => (
  <Wrapper>
    <Router />
  </Wrapper>
);

export const ThemedRouter = () => {
  const { mode } = useTheme();

  return (
    <ThemeProvider theme={{ mode }}>
      <WrappedRouter />
    </ThemeProvider>
  );
};

export const Providers = withProviders(
  APIProvider,
  ModalProvider,
  ConnectProvider,
  AssistantProvider,
  SideBarProvider,
  NetworkMetricsProvider,
  AccountProvider,
  BalancesProvider,
  StakingProvider,
  PoolsConfigProvider,
  BondedPoolsProvider,
  PoolMembershipsProvider,
  ActivePoolProvider,
  ValidatorsProvider,
  UIProvider,
  MessagesProvider,
  SubscanProvider,
  MenuProvider,
  NotificationsProvider,
  ExtrinsicsProvider,
  SessionEraProvider
)(ThemedRouter);

export default Providers;
