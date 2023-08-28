// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from 'types';

export const graphColors: Record<string, AnyJson> = {
  inactive: {
    light: '#eee',
    dark: 'rgb(39,35,39)',
  },
  tooltip: {
    light: '#333',
    dark: '#ddd',
  },
  label: {
    light: '#fafafa',
    dark: '#0e0e0e',
  },
  grid: {
    light: '#e8e8e8',
    dark: 'rgb(64,55,64)',
  },
};
