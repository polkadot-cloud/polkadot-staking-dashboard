// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProvider } from 'styled-components';
import { Entry } from '@polkadotcloud/core-ui';
import { Router } from 'Router';
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';

// App-wide theme classes are inserted here.
//
// App-specific theming is added to `ThemeProvider`.
// `@polkadotcloud/core-ui` themes are added to `Entry`.
export const ThemedRouter = () => {
  const { mode } = useTheme();
  const { network } = useApi();

  return (
    <ThemeProvider theme={{ mode, network: `${network.name}-${mode}` }}>
      <Entry mode={mode} chain={`${network.name}-relay`}>
        <Router />
      </Entry>
    </ThemeProvider>
  );
};
