// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EntryWrapper as Wrapper } from './Wrappers';
import Router from './Router';
import { ThemeProvider } from 'styled-components';
import { withProviders } from './library/Hooks';
import { StakingContextWrapper } from './contexts/Staking';
import { MessagesContextWrapper } from './contexts/Messages';
import { SubscanContextWrapper } from './contexts/Subscan';
import { ValidatorsContextWrapper } from './contexts/Validators';
import { NotificationsContextWrapper } from './contexts/Notifications';
import { ExtrinsicsContextWrapper } from './contexts/Extrinsics';
import { UIContextWrapper } from './contexts/UI';
import { NetworkMetricsContextWrapper } from './contexts/Network';
import { BalancesContextWrapper } from './contexts/Balances';
import { ConnectContextWrapper } from './contexts/Connect';
import { AssistantContextWrapper } from './contexts/Assistant';
import { ModalContextWrapper } from './contexts/Modal';
import { APIContextWrapper } from './contexts/Api';
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
  APIContextWrapper,
  ConnectContextWrapper,
  AssistantContextWrapper,
  ModalContextWrapper,
  NetworkMetricsContextWrapper,
  BalancesContextWrapper,
  BrowserRouter,
  StakingContextWrapper,
  ValidatorsContextWrapper,
  UIContextWrapper,
  MessagesContextWrapper,
  SubscanContextWrapper,
  NotificationsContextWrapper,
  ExtrinsicsContextWrapper,
)(
  ProvidersInner
);

export default Providers;