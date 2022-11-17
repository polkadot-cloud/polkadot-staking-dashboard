// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson } from 'types';

// Load language resources dynamically.
//
// Bootstraps i18next with additional language resources.
export const loadLngAsync = async (lng: string) => {
  const resources: AnyJson = await Promise.all([
    await import(`./${lng}/base.json`),
    await import(`./${lng}/help.json`),
  ]);

  const base = resources[0].base;
  const help = resources[1].help;

  return {
    l: lng,
    r: {
      base,
      help,
    },
  };
};
