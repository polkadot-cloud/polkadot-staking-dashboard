// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LOCALE } from 'consts';
import commoncn from './cn/common.json';
import commonen from './en/common.json';
import pagescn from './cn/pages.json';
import pagesen from './en/pages.json';
import helpen from './en/help.json';
import helpcn from './cn/help.json';

// construct resources.
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

// get locale from localStorage.
const _locale = localStorage.getItem('locale');
const locale = _locale ?? DEFAULT_LOCALE;

if (!_locale) {
  localStorage.setItem('locale', DEFAULT_LOCALE);
}

// configure i18n object.
i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    debug: true,
    resources,
  });

// export i18next for context.
export { i18next };

// available languages as an array of strings.
export const availableLanguages = Object.keys(resources);

// map i18n to moment locale keys, with any custom amendments.
const i18ToMomentLocaleMap: { [key: string]: string } = {
  ...Object.fromEntries(availableLanguages.map((a: string) => [a, a])),
  cn: 'zh-en',
};

// convert i18 locale key to moment key if needed.
export const i18ToMomentLocale = (l: string) => {
  return i18ToMomentLocaleMap[l] || DEFAULT_LOCALE;
};
