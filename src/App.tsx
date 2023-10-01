// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { DefaultNetwork } from 'consts';
import { ThemesProvider } from 'contexts/Themes';
import { i18next } from 'locale';
import { APIProvider } from 'contexts/Api';
import { Providers } from 'Providers';

export const App: React.FC = () => {
  let network = localStorage.getItem('network');

  if (network === null) {
    network = DefaultNetwork;
    localStorage.setItem('network', network);
  }

  return (
    <I18nextProvider i18n={i18next}>
      <APIProvider>
        <ThemesProvider>
          <Providers />
        </ThemesProvider>
      </APIProvider>
    </I18nextProvider>
  );
};
