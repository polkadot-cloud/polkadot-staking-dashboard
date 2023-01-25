// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountProvider } from 'contexts/Account';
import { APIProvider, useApi } from 'contexts/Api';
import { AssetsProvider } from 'contexts/Assets';
import { BalancesProvider } from 'contexts/Balances';
import { ConnectProvider } from 'contexts/Connect';
import { ExtensionsProvider } from 'contexts/Extensions';
import { ExtrinsicsProvider } from 'contexts/Extrinsics';
import { FiltersProvider } from 'contexts/Filters';
import { HelpProvider } from 'contexts/Help';
import { MenuProvider } from 'contexts/Menu';
import { ModalProvider } from 'contexts/Modal';
import { NetworkMetricsProvider } from 'contexts/Network';
import { NotificationsProvider } from 'contexts/Notifications';
import { OverlayProvider } from 'contexts/Overlay';
import { PluginsProvider } from 'contexts/Plugins';
import { useTheme } from 'contexts/Themes';
import { TooltipProvider } from 'contexts/Tooltip';
import { TxFeesProvider } from 'contexts/TxFees';
import { UIProvider } from 'contexts/UI';
import { withProviders } from 'library/Hooks';
import Router from 'Router';
import { ThemeProvider } from 'styled-components';
import { EntryWrapper as Wrapper } from 'Wrappers';

// `polkadot-dashboard-ui` theme classes are inserted here.
export const WrappedRouter = () => {
  const { mode } = useTheme();
  const { network } = useApi();

  return (
    <Wrapper className={`theme-${network.name} theme-${mode}`}>
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
  FiltersProvider,
  APIProvider,
  ExtensionsProvider,
  ConnectProvider,
  HelpProvider,
  NetworkMetricsProvider,
  AccountProvider,
  BalancesProvider,
  UIProvider,
  PluginsProvider,
  MenuProvider,
  TooltipProvider,
  NotificationsProvider,
  ExtrinsicsProvider,
  ModalProvider,
  OverlayProvider,
  TxFeesProvider,
  AssetsProvider
)(ThemedRouter);

export default Providers;
