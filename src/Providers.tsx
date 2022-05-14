// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EntryWrapper as Wrapper } from './Wrappers';
import Router from './Router';
import { ThemeProvider } from 'styled-components';
import { withProviders } from './library/Hooks';
import { APIProvider } from './contexts/Api';
import { AssistantProvider } from './contexts/Assistant';
import { BalancesProvider } from './contexts/Balances';
import { ConnectProvider } from './contexts/Connect';
import { ExtrinsicsProvider } from './contexts/Extrinsics';
import { MessagesProvider } from './contexts/Messages';
import { ModalProvider } from './contexts/Modal';
import { NetworkMetricsProvider } from './contexts/Network';
import { NotificationsProvider } from './contexts/Notifications';
import { PoolsProvider } from './contexts/Pools';
import { SideBarProvider } from './contexts/SideBar';
import { StakingProvider } from './contexts/Staking';
import { SubscanProvider } from './contexts/Subscan';
import { ValidatorsProvider } from './contexts/Validators/Validators';
import { UIProvider } from './contexts/UI';
import { useTheme } from './contexts/Themes';

export const WrappedRouter = () =>
  <Wrapper>
    <Router />
  </Wrapper>;

export const ThemedRouter = () => {
  const { mode } = useTheme();

  return (
    <ThemeProvider theme={{ mode: mode }}>
      <WrappedRouter />
    </ThemeProvider>
  );
}

export const Providers = withProviders(
  APIProvider,
  ModalProvider,
  ConnectProvider,
  AssistantProvider,
  SideBarProvider,
  NetworkMetricsProvider,
  BalancesProvider,
  StakingProvider,
  ValidatorsProvider,
  PoolsProvider,
  UIProvider,
  MessagesProvider,
  SubscanProvider,
  NotificationsProvider,
  ExtrinsicsProvider,
)(
  ThemedRouter
);

export default Providers;