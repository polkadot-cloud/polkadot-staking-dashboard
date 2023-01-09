// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultLocale } from 'consts';
import { AnyApi, AnyJson } from 'types';
import { extractUrlValue } from 'Utils';
import { availableLanguages, fallbackResources, lngNamespaces } from '.';

// Gets the active language
//
// Get the stored language from localStorage, or fallback to
// DefaultLocale otherwise.

export const getInitialLanguage = () => {
  // get language from url if present
  const urlLng = extractUrlValue('l');
  if (availableLanguages.find((n: any) => n[0] === urlLng) && urlLng) {
    localStorage.setItem('lng', urlLng);
    return urlLng;
  }

  // fall back to localStorage if present.
  const localLng = localStorage.getItem('lng');
  if (availableLanguages.find((n: any) => n[0] === localLng) && localLng) {
    return localLng;
  }

  localStorage.setItem('lng', DefaultLocale);
  return DefaultLocale;
};

// Determine resources of selected language, and whether a dynamic
// import is needed for missing language resources.
//
// If selected language is DefaultLocale, then we fall back to
// the default language resources that have already been imported.
export const getResources = (lng: string) => {
  let dynamicLoad = false;

  let resources: AnyJson = null;
  if (lng === DefaultLocale) {
    // determine resources exist without dynamically importing them.
    resources = {
      en: fallbackResources,
    };
    localStorage.setItem(
      'lng_resources',
      JSON.stringify({ l: DefaultLocale, r: fallbackResources })
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
        en: fallbackResources,
      };
    }
  }
  return {
    resources,
    dynamicLoad,
  };
};

// Change language
//
// On click handler for changing language in-app.
export const changeLanguage = async (lng: string, i18next: AnyApi) => {
  // check whether resources exist and need to by dynamically loaded.
  const { resources, dynamicLoad } = getResources(lng);

  localStorage.setItem('lng', lng);
  // dynamically load default language resources if needed.
  if (dynamicLoad) {
    await doDynamicImport(lng, i18next);
  } else {
    localStorage.setItem(
      'lng_resources',
      JSON.stringify({ l: lng, r: resources })
    );
    i18next.changeLanguage(lng);
  }
  if (window.location.hash.includes('l=')) {
    window.location.hash = window.location.hash.replace(
      window.location.hash.substring(window.location.hash.indexOf('l=') + 2),
      lng
    );
  }
};

// Load language resources dynamically.
//
// Bootstraps i18next with additional language resources.
export const loadLngAsync = async (l: string) => {
  const resources: AnyJson = await Promise.all(
    lngNamespaces.map(async (u: string) => {
      const mod = await import(`./${l}/${u}.json`);
      return mod;
    })
  );

  const r: AnyJson = {};
  resources.forEach((mod: AnyJson, i: number) => {
    r[lngNamespaces[i]] = mod[lngNamespaces[i]];
  });

  return {
    l,
    r,
  };
};

// Handles a dynamic import
//
// Once imports have been loaded, they are added to i18next as resources.
// Finally, the active langauge is changed to the imported language.
export const doDynamicImport = async (lng: string, i18next: AnyApi) => {
  const { l, r } = await loadLngAsync(lng);
  localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }));

  Object.entries(r).forEach(([ns, inner]: [string, AnyJson]) => {
    i18next.addResourceBundle(l, ns, inner);
  });
  i18next.changeLanguage(l);
};
