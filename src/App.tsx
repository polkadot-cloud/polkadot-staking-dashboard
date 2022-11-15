// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultNetwork } from 'consts';
import { ThemesProvider } from 'contexts/Themes';
import { init } from 'locale';
import { Providers } from 'Providers';
import React from 'react';

const App: React.FC = () => {
  let network = localStorage.getItem('network');

  if (network === null) {
    network = DefaultNetwork;
    localStorage.setItem('network', network);
  }
  init();

  return (
    <ThemesProvider>
      <Providers />
    </ThemesProvider>
  );
};

export default App;
