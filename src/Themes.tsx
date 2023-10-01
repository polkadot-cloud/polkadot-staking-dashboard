// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ThemeProvider } from 'styled-components';
import { Entry } from '@polkadot-cloud/react';
import { Router } from 'Router';
import { useTheme } from 'contexts/Themes';
import { useNetwork } from 'contexts/Network';

// App-wide theme classes are inserted here.
//
// App-specific theming is added to `ThemeProvider`.
// `@polkadot-cloud/react` themes are added to `Entry`.
export const ThemedRouter = () => {
  const { mode } = useTheme();
  const { networkData } = useNetwork();

  return (
    <ThemeProvider theme={{ mode }}>
      <Entry mode={mode} theme={`${networkData.name}-relay`}>
        <Router />
      </Entry>
    </ThemeProvider>
  );
};
