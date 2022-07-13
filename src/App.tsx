// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DEFAULT_NETWORK } from 'consts';
import { Providers } from 'Providers';
import { ThemesProvider } from 'contexts/Themes';
import { ErrorBoundary } from 'ErrorsBoundary';

const App: React.FC = () => {
  let network = localStorage.getItem('network');

  if (network === null) {
    network = DEFAULT_NETWORK;
    localStorage.setItem('network', network);
  }

  if (!localStorage) throw new Error('LocalStorage Is Not Supported');

  return (
    <ErrorBoundary message="Opps, Something Went Wrong">
      <ThemesProvider>
        <Providers />
      </ThemesProvider>
    </ErrorBoundary>
  );
};

export default App;
