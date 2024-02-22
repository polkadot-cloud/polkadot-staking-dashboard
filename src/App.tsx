// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ThemesProvider } from 'contexts/Themes';
import { i18next } from 'locale';
import { Providers } from 'Providers';
import { NetworkProvider } from 'contexts/Network';
import { ActiveAccountsProvider } from 'contexts/ActiveAccounts';

export const App: FC = () => (
  <I18nextProvider i18n={i18next}>
    <ThemesProvider>
      <NetworkProvider>
        <ActiveAccountsProvider>
          <Providers />
        </ActiveAccountsProvider>
      </NetworkProvider>
    </ThemesProvider>
  </I18nextProvider>
);
