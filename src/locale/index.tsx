// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppVersion, DefaultLocale } from 'consts';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AnyJson } from 'types';
import baseEn from './en/base.json';
import helpEn from './en/help.json';
import { doDynamicImport } from './utils';

// the supported namespaces
export const lngNamespaces = ['base', 'help'];

// the active language
let lng: string;

// whether a dynamic import is needed
let dynamicLoad = false;

// default structure of language resources
const resourcesInnerDefault = { ...baseEn, ...helpEn };

// check app version, wipe `lng_resources` if version is different.
const localAppVersion = localStorage.getItem('app_version');
if (localAppVersion !== AppVersion) {
  localStorage.removeItem('lng_resources');
  // localisation is currently the only feature that uses AppVersion.
  // if more features require AppVersion in the future, this should be
  // abstracted into a separate script that checks / updates AppVersion
  // after any tidy up is completed.
  localStorage.setItem('app_version', AppVersion);
}

// determine the default language.
const localLng = localStorage.getItem('lng');
if (!localLng) {
  lng = DefaultLocale;
  localStorage.setItem('lng', DefaultLocale);
} else {
  lng = localLng;
}

// determine resources exist without dynamically importing them.
let resources: AnyJson = null;
if (lng === DefaultLocale) {
  resources = {
    en: resourcesInnerDefault,
  };
  localStorage.setItem(
    'lng_resources',
    JSON.stringify({ l: DefaultLocale, r: resourcesInnerDefault })
  );
} else {
  // not the default locale, check if local resources exist
  let localValid = false;
  const localResources = localStorage.getItem('lng_resources');
  if (localResources !== null) {
    const { l, r } = JSON.parse(localResources);

    if (l === lng) {
      localValid = true;
      // local resources found, load them in
      resources = {
        [lng]: {
          ...r,
        },
      };
    }
  }

  if (!localValid) {
    // no resources exist locally, dynamic import needed.
    dynamicLoad = true;
    resources = {
      en: resourcesInnerDefault,
    };
  }
}

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
