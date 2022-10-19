// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import moment from 'moment';
import { i18ToMomentLocale } from 'locale';
import { useTranslation } from 'react-i18next';

export const LocaleContext = React.createContext<any>(null);

export const useLocale = () => React.useContext(LocaleContext);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  // set the currently active locale
  const [locale, _setLocale] = useState<string>(
    i18ToMomentLocale(i18n.resolvedLanguage)
  );

  // set the default moment locale
  moment.locale(i18ToMomentLocale(i18n.resolvedLanguage));

  // handler for updating a locale
  const setLocale = async (l: string) => {
    await i18n.changeLanguage(l);
    localStorage.setItem('locale', l);
    moment.locale(i18ToMomentLocale(l));
    _setLocale(l);
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};
