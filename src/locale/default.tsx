// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultLocale } from 'consts';
import { AnyJson } from 'types';

// Load a default lanauge.
//
// Bootstraps i18next with a default language.
export const loadDefault = async () => {
  // get locale from localStorage.
  const localLng = localStorage.getItem('lng');
  const lng = localLng ?? DefaultLocale;

  const resources: AnyJson = await Promise.all([
    await import(`./${lng}/pages.json`),
    await import(`./${lng}/help.json`),
  ]);

  const pages = resources[0].pages;
  const help = resources[1].help;

  return {
    key: lng,
    value: {
      pages,
      help,
    },
  };
};
