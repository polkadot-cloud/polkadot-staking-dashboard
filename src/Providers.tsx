// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EntryWrapper as Wrapper } from './Wrappers';
import Router from './Router';
import { ThemeProvider } from 'styled-components';
import { withProviders } from './library/Hooks';
import { StakingProvider } from './contexts/Staking';
import { PoolsProvider } from './contexts/Pools';
import { MessagesProvider } from './contexts/Messages';
import { SubscanProvider } from './contexts/Subscan';
import { ValidatorsProvider } from './contexts/Validators/Validators';
import { NotificationsProvider } from './contexts/Notifications';
import { ExtrinsicsProvider } from './contexts/Extrinsics';
import { UIProvider } from './contexts/UI';
import { NetworkMetricsProvider } from './contexts/Network';
import { BalancesProvider } from './contexts/Balances';
import { ConnectProvider } from './contexts/Connect';
import { AssistantProvider } from './contexts/Assistant';
import { ModalProvider } from './contexts/Modal';
import { APIProvider } from './contexts/Api';
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
    <ThemeProvider theme={{ mode: mode }}>
      <WrappedRouter />
    </ThemeProvider>
  );
};

export const Providers = withProviders(
  APIProvider,
  ModalProvider,
  ConnectProvider,
  AssistantProvider,
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
  SessionEraProvider
)(ThemedRouter);

export default Providers;
