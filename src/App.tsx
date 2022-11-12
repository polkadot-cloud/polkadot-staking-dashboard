// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultNetwork } from 'consts';
import { ThemesProvider } from 'contexts/Themes';
import { i18next } from 'locale';
import { Providers } from 'Providers';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

const App: React.FC = () => {
  let network = localStorage.getItem('network');

  if (network === null) {
    network = DefaultNetwork;
    localStorage.setItem('network', network);
  }

  return (
    <I18nextProvider i18n={i18next}>
      <ThemesProvider>
        <Providers />
      </ThemesProvider>
    </I18nextProvider>
  );
};

export default App;
