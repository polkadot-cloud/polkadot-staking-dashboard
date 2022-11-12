// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultLocale } from 'consts';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import pagesCn from './cn/pages.json';
import pagesEn from './en/pages.json';

// get locale from localStorage.
const localLng = localStorage.getItem('lng');
const lng = localLng ?? DefaultLocale;

if (!localLng) {
  localStorage.setItem('lng', DefaultLocale);
}

// construct resources.
export const resources = {
  en: {
    ...pagesEn,
  },
  cn: {
    ...pagesCn,
  },
};

// configure i18n object.
i18next.use(initReactI18next).init({
  debug: process.env.REACT_APP_DEBUG_I18N === '1',
  fallbackLng: DefaultLocale,
  lng,
  resources,
});

// export i18next for context.
export { i18next };

// available languages as an array of strings.
export const availableLanguages = Object.keys(resources);
