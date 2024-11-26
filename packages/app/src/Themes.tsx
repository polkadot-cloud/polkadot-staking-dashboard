// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Router } from 'Router';
import { useNetwork } from 'contexts/Network';
import { useTheme } from 'contexts/Themes';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { Entry } from 'ui-structure';

// light / dark `mode` added to styled-components provider
export const ThemedRouter = () => {
  const { mode } = useTheme();
  const { network } = useNetwork();

  // Update body background to `--background-default` color upon theme change.
  useEffect(() => {
    const elem = document.querySelector('.core-entry');
    if (elem) {
      document.getElementsByTagName('body')[0].style.backgroundColor =
        getComputedStyle(elem).getPropertyValue('--background-default');
    }
  }, [mode]);

  return (
    <ThemeProvider theme={{ mode }}>
      <Entry mode={mode} theme={`${network}-relay`}>
        <Router />
      </Entry>
    </ThemeProvider>
  );
};
