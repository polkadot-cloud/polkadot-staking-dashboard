// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppVersion, DefaultLocale } from 'consts';
import { enGB, zhCN } from 'date-fns/locale';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AnyJson } from 'types';
import baseEn from './en/base.json';
import helpEn from './en/help.json';
import libEn from './en/library.json';
import modalsEn from './en/modals.json';
import pagesEn from './en/pages.json';
import tipsEn from './en/tips.json';
import { doDynamicImport, getActiveLanguage, getResources } from './utils';

// available locales as key value pairs
export const locales: { [key: string]: AnyJson } = {
  en: enGB,
  cn: zhCN,
};

// available languages as an array of strings.
export const availableLanguages: Array<string> = ['en', 'cn'];

// the supported namespaces.
export const lngNamespaces = [
  'base',
  'help',
  'library',
  'modals',
  'pages',
  'tips',
];

// default structure of language resources.
export const fallbackResources = {
  ...baseEn,
  ...helpEn,
  ...libEn,
  ...modalsEn,
  ...pagesEn,
  ...tipsEn,
};

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
const { resources, dynamicLoad } = getResources(lng);

// default language to show before any dynamic load
const defaultLng = dynamicLoad ? DefaultLocale : lng;

// configure i18n object.
i18next.use(initReactI18next).init({
  debug: process.env.REACT_APP_DEBUG_I18N === '1',
  fallbackLng: DefaultLocale,
  lng: defaultLng,
  resources,
});

// dynamically load default language resources if needed.
if (dynamicLoad) {
  doDynamicImport(lng, i18next);
}

// map i18n to BCP 47 keys, with any custom amendments.
const i18ToLocaleMap: { [key: string]: string } = {
  ...Object.fromEntries(availableLanguages.map((a: string) => [a, a])),
  en: 'en-gb',
  cn: 'zh-cn',
};

// convert i18n locale key to BCP 47 key if needed.
export const i18ToLocale = (l: string) => {
  return i18ToLocaleMap[l] || DefaultLocale;
};

// export i18next for context.
export { i18next };
