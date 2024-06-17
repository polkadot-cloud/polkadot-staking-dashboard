// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ThemeProvider } from 'styled-components';
import { Router } from 'Router';
import { useTheme } from 'contexts/Themes';
import { useNetwork } from 'contexts/Network';
import { useEffect } from 'react';
import { Entry } from 'kits/Structure/Entry';

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
