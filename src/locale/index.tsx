// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppVersion, DefaultLocale } from 'consts';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import baseEn from './en/base.json';
import helpEn from './en/help.json';
import tipsEn from './en/tips.json';
import { doDynamicImport, getActiveLanguage, getResources } from './utils';

// the supported namespaces.
export const lngNamespaces = ['base', 'help', 'tips'];

// default structure of language resources.
const fallbackResources = { ...baseEn, ...helpEn, ...tipsEn };

// check app version, wipe `lng_resources` if version is different.
const localAppVersion = localStorage.getItem('app_version');
if (localAppVersion !== AppVersion || process.env.NODE_ENV === 'development') {
  localStorage.removeItem('lng_resources');
  // localisation is currently the only feature that uses AppVersion.
  // if more features require AppVersion in the future, this should be
  // abstracted into a separate script that checks / updates AppVersion
  // after any tidy up is completed.
  localStorage.setItem('app_version', AppVersion);
}

// get active language.
const lng: string = getActiveLanguage();

// get default resources and whether a dynamic load is required for
// the active language.
const { resources, dynamicLoad } = getResources(lng, fallbackResources);

// // get locale from localStorage.
// const _locale = localStorage.getItem('locale');
// const locale = _locale ?? DefaultLocale;

// if (!_locale) {
//   localStorage.setItem('locale', DefaultLocale);
// }

// configure i18n object.
i18next.use(initReactI18next).init({
  debug: process.env.REACT_APP_DEBUG_I18N === '1',
  fallbackLng: DefaultLocale,
  lng: dynamicLoad ? DefaultLocale : lng,
  resources,
});

// dynamically load default language resources if needed.
if (dynamicLoad) {
  doDynamicImport(lng, i18next);
}

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
  return i18ToMomentLocaleMap[l] || DefaultLocale;
};
