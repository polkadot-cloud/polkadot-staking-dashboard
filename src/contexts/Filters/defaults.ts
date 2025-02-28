// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { FiltersContextInterface } from './types';

export const defaultFiltersInterface: FiltersContextInterface = {
  getFilters: (type, group) => [],
  toggleFilter: (type, g, f) => {},
  setMultiFilters: (type, g, fs, r) => {},
  getOrder: (g) => 'default',
  setOrder: (g, o) => {},
  getSearchTerm: (g) => null,
  setSearchTerm: (g, searchTerm) => {},
  resetFilters: (t, g) => {},
  resetOrder: (g) => {},
  clearSearchTerm: (g) => {},
  applyFilters: (type, g, l, f) => {},
  applyOrder: (g, l, f) => {},
};
