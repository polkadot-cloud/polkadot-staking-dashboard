// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DEFAULT_LOCALE, DEFAULT_NS } from 'consts';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import commoncn from './cn/common.json';
import helpcn from './cn/help.json';
import pagescn from './cn/pages.json';
import tipscn from './cn/tips.json';
import commonen from './en/common.json';
import helpen from './en/help.json';
import pagesen from './en/pages.json';
import tipsen from './en/tips.json';

// construct resources.
export const resources = {
  en: {
    common: commonen,
    help: helpen,
    pages: pagesen,
    tips: tipsen,
  },
  cn: {
    common: commoncn,
    help: helpcn,
    pages: pagescn,
    tips: tipscn,
  },
};

// get locale from localStorage.
const _locale = localStorage.getItem('locale');
const locale = _locale ?? DEFAULT_LOCALE;

if (!_locale) {
  localStorage.setItem('locale', DEFAULT_LOCALE);
}

// configure i18n object.
i18next.use(initReactI18next).init(
  {
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    interpolation: { escapeValue: false },
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    fallbackNS: DEFAULT_NS,
    debug: process.env.REACT_APP_DEBUG_I18N === '1',
    resources,
  },
  (err) => {
    if (err)
      return console.log('Something went wrong with the locale system', err);
  }
);

// export i18next for context.
export { i18next };

// available languages as an array of strings.
export const availableLanguages = Object.keys(resources);

// map i18n to moment locale keys, with any custom amendments.
const i18ToMomentLocaleMap: { [key: string]: string } = {
  ...Object.fromEntries(availableLanguages.map((a: string) => [a, a])),
  cn: 'zh-cn',
};

// convert i18 locale key to moment key if needed.
export const i18ToMomentLocale = (l: string) => {
  return i18ToMomentLocaleMap[l] || DEFAULT_LOCALE;
};
