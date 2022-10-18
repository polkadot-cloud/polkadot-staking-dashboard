// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DEFAULT_NETWORK } from 'consts';
import { ThemesProvider } from 'contexts/Themes';
import { Providers } from 'Providers';
import React from 'react';

const App: React.FC = () => {
  let network = localStorage.getItem('network');

  if (network === null) {
    network = DEFAULT_NETWORK;
    localStorage.setItem('network', network);
  }

  return (
    <ThemesProvider>
      <Providers />
    </ThemesProvider>
  );
};

export default App;
