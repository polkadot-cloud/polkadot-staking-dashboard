// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson } from 'types';

// Load language resources dynamically.
//
// Bootstraps i18next with additional language resources.
export const loadDefault = async (lng: string) => {
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
