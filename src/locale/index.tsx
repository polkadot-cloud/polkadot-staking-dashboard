// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultLocale } from 'consts';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AnyJson } from 'types';
import { loadLngAsync } from './default';
import baseEn from './en/base.json';
import helpEn from './en/help.json';

// the supported namespaces
export const lngNamespaces = ['base', 'help'];

let lng: string;
let dynamicLoad = false;

const resourcesInnerDefault = { ...baseEn, ...helpEn };
const localLng = localStorage.getItem('lng');

// determine the default language.
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
(async () => {
  if (!dynamicLoad) {
    return;
  }
  const { l, r } = await loadLngAsync(lng);

  localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }));

  Object.entries(r).forEach(([ns, inner]: [string, AnyJson]) => {
    i18next.addResourceBundle(l, ns, inner);
  });

  i18next.changeLanguage(l);
})();

// export i18next for context.
export { i18next };
