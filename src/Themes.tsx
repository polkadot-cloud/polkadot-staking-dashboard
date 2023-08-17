// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ThemeProvider } from 'styled-components';
import { Entry } from '@polkadot-cloud/react';
import { Router } from 'Router';
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';

// App-wide theme classes are inserted here.
//
// App-specific theming is added to `ThemeProvider`.
// `@polkadot-cloud/react` themes are added to `Entry`.
export const ThemedRouter = () => {
  const { mode } = useTheme();
  const { network } = useApi();

  return (
    <ThemeProvider theme={{ mode }}>
      <Entry mode={mode} theme={`${network.name}-relay`}>
        <Router />
      </Entry>
    </ThemeProvider>
  );
};
