// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppVersion, DefaultNetwork } from 'consts';
import { ThemesProvider } from 'contexts/Themes';
import { i18next } from 'locale';
import { Providers } from 'Providers';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

export const App: React.FC = () => {
  let network = localStorage.getItem('network');

  // Handle app version migration.
  const localAppVersion = localStorage.getItem('app_version');
  if (
    localAppVersion !== AppVersion ||
    process.env.NODE_ENV === 'development'
  ) {
    // Check app version, wipe `lng_resources` if version is different.
    // Should run on every app version update.
    localStorage.removeItem('lng_resources');
    localStorage.setItem('app_version', AppVersion);

    // Introduced in 1.0.4: Remove localStorage setup items. New structure now exists.
    // TODO: implement.
  }

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
