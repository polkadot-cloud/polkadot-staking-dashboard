// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { i18ToLocale } from 'locale';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LocaleContext = React.createContext<any>(null);

export const useLocale = () => React.useContext(LocaleContext);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  // set the currently active locale in BCP 47 format
  const [locale, _setLocale] = useState<string>(
    i18ToLocale(i18n.resolvedLanguage)
  );

  // handler for updating a locale
  const setlocale = async (l: string) => {
    await i18n.changeLanguage(l);
    _setLocale(i18ToLocale(l));
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setlocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};
