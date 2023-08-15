// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { FiltersContextInterface } from './types';

export const defaultFiltersInterface: FiltersContextInterface = {
  getFilters: (t, g) => [],
  toggleFilter: (t, g, f) => {},
  setMultiFilters: (t, g, fs, r) => {},
  getOrder: (g) => 'default',
  setOrder: (g, o) => {},
  getSearchTerm: (g) => null,
  setSearchTerm: (g, t) => {},
  resetFilters: (t, g) => {},
  resetOrder: (g) => {},
  clearSearchTerm: (g) => {},
  applyFilters: (t, g, l, f) => {},
  applyOrder: (g, l, f) => {},
};
