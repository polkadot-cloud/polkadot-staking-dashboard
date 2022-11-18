// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson } from 'types';
import { lngNamespaces } from './index';

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
export const doDynamicImport = async (lng: string, i18next: AnyJson) => {
  const { l, r } = await loadLngAsync(lng);

  localStorage.setItem('lng_resources', JSON.stringify({ l: lng, r }));

  Object.entries(r).forEach(([ns, inner]: [string, AnyJson]) => {
    i18next.addResourceBundle(l, ns, inner);
  });

  i18next.changeLanguage(l);
};
