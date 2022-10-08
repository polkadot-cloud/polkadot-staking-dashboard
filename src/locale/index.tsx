// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import commoncn from './cn/common.json';
import commonen from './en/common.json';
import pagescn from './cn/pages.json';
import pagesen from './en/pages.json';
import helpen from './en/help.json';
import helpcn from './cn/help.json';

// construct resources
export const resources = {
  en: {
    common: commonen,
    help: helpen,
    pages: pagesen,
  },
  cn: {
    common: commoncn,
    help: helpcn,
    pages: pagescn,
  },
};

// configure i18n object
i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    resources,
  });

// export i18next for context
export { i18next };

// available languages as an array of strings
export const availableLanguages = Object.keys(resources);
