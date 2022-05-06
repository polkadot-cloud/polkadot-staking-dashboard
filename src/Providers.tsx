// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EntryWrapper as Wrapper } from './Wrappers';
import Router from './Router';
import { ThemeProvider } from 'styled-components';
import { withProviders } from './library/Hooks';
import { StakingProvider } from './contexts/Staking';
import { PoolsProvider } from './contexts/Pools';
import { MessagesProvider } from './contexts/Messages';
import { SubscanProvider } from './contexts/Subscan';
import { ValidatorsProvider } from './contexts/Validators';
import { NotificationsProvider } from './contexts/Notifications';
import { ExtrinsicsProvider } from './contexts/Extrinsics';
import { UIProvider } from './contexts/UI';
import { NetworkMetricsProvider } from './contexts/Network';
import { BalancesProvider } from './contexts/Balances';
import { ConnectProvider } from './contexts/Connect';
import { AssistantProvider } from './contexts/Assistant';
import { ModalProvider } from './contexts/Modal';
import { APIProvider } from './contexts/Api';
import { BrowserRouter } from "react-router-dom";
import { useTheme } from './contexts/Themes';

export const ProvidersInner = () => {

  const { mode } = useTheme();

  return (
    <ThemeProvider theme={{ mode: mode }}>
      <Wrapper>
        <Router />
      </Wrapper>
    </ThemeProvider>
  );
}

export const Providers = withProviders(
  APIProvider,
  ModalProvider,
  ConnectProvider,
  AssistantProvider,
  NetworkMetricsProvider,
  BalancesProvider,
  BrowserRouter,
  StakingProvider,
  ValidatorsProvider,
  PoolsProvider,
  UIProvider,
  MessagesProvider,
  SubscanProvider,
  NotificationsProvider,
  ExtrinsicsProvider,
)(
  ProvidersInner
);

export default Providers;