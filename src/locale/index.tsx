// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { enGB, zhCN } from 'date-fns/locale';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { version } from '../../package.json';
import type { AnyJson } from '@w3ux/types';
import baseEn from './en/base.json';
import helpEn from './en/help.json';
import libEn from './en/library.json';
import modalsEn from './en/modals.json';
import pagesEn from './en/pages.json';
import tipsEn from './en/tips.json';
import { doDynamicImport, getInitialLanguage, getResources } from './utils';

// The default locale.
export const DefaultLocale = 'en';

// Available locales as key value pairs
export const locales: Record<string, AnyJson> = {
  en: enGB,
  cn: zhCN,
};

// Available languages as an array of strings.
export const availableLanguages: string[][] = [
  ['en', 'English'],
  ['cn', '中文'],
];

// Supported namespaces.
export const lngNamespaces = [
  'base',
  'help',
  'library',
  'modals',
  'pages',
  'tips',
];

// Default structure of language resources.
export const fallbackResources = {
  ...baseEn,
  ...helpEn,
  ...libEn,
  ...modalsEn,
  ...pagesEn,
  ...tipsEn,
};

// Refresh local storage resources if in development, or if new app version is present.
if (
  localStorage.getItem('app_version') !== version ||
  import.meta.env.MODE === 'development'
) {
  localStorage.removeItem('lng_resources');
}

// Get initial language.
const lng: string = getInitialLanguage();

// Get default resources and whether a dynamic load is required for
// the active language.
const { resources, dynamicLoad } = getResources(lng);

// Default language to show before any dynamic load
const defaultLng = dynamicLoad ? DefaultLocale : lng;

// Configure i18n object.
i18next.use(initReactI18next).init({
  debug: import.meta.env.VITE_DEBUG_I18N === '1',
  fallbackLng: DefaultLocale,
  lng: defaultLng,
  resources,
});

// Dynamically load default language resources if needed.
if (dynamicLoad) {
  doDynamicImport(lng, i18next);
}

// Map i18n to BCP 47 keys, with any custom amendments.
const i18ToLocaleMap: Record<string, string> = {
  ...Object.fromEntries(availableLanguages.map((a) => [a[0], a[0]])),
  en: 'en-gb',
  cn: 'zh-cn',
};

// Convert i18n locale key to BCP 47 key if needed.
export const i18ToLocale = (l: string) => i18ToLocaleMap[l] || DefaultLocale;

export { i18next };
