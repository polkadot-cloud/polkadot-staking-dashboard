// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultLocale, FallbackNS } from 'consts';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import pagesCn from './cn/pages.json';
import pagesEn from './en/pages.json';

// construct resources.
export const resources = {
  en: {
    ...pagesEn,
  },
  cn: {
    ...pagesCn,
  },
};

// get locale from localStorage.
const _locale = localStorage.getItem('locale');
const locale = _locale ?? DefaultLocale;

if (!_locale) {
  localStorage.setItem('locale', DefaultLocale);
}

// configure i18n object.
i18next.use(initReactI18next).init(
  {
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    interpolation: { escapeValue: false },
    lng: locale,
    fallbackLng: DefaultLocale,
    fallbackNS: FallbackNS,
    debug: process.env.REACT_APP_DEBUG_I18N === '1',
    resources,
  },
  () => {
    /* locale error */
  }
);

// export i18next for context.
export { i18next };

// available languages as an array of strings.
export const availableLanguages = Object.keys(resources);
