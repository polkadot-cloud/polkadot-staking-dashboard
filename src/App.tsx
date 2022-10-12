// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DEFAULT_NETWORK } from 'consts';
import { Providers } from 'Providers';
import { ThemesProvider } from 'contexts/Themes';
import { i18next } from 'locale';
import { I18nextProvider } from 'react-i18next';

const App: React.FC = () => {
  let network = localStorage.getItem('network');
  let locale = localStorage.getItem('locale');

  if (network === null) {
    network = DEFAULT_NETWORK;
    localStorage.setItem('network', network);
  }
  if (locale === null) {
    locale = 'en';
    localStorage.setItem('locale', locale);
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
