// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FiltersContextInterface } from './types';

export const defaultFiltersInterface: FiltersContextInterface = {
  // eslint-disable-next-line
  getFilters: (t, g) => [],
  // eslint-disable-next-line
  toggleFilter: (t, g, f) => {},
  // eslint-disable-next-line
  setMultiFilters: (t, g, fs, r) => {},
  // eslint-disable-next-line
  getOrder: (g) => 'default',
  // eslint-disable-next-line
  setOrder: (g, o) => {},
  // eslint-disable-next-line
  getSearchTerm: (g) => null,
  // eslint-disable-next-line
  setSearchTerm: (g, t) => {},
  // eslint-disable-next-line
  resetFilters: (t, g) => {},
  // eslint-disable-next-line
  resetOrder: (g) => {},
  // eslint-disable-next-line
  clearSearchTerm: (g) => {},
  // eslint-disable-next-line
  applyFilters: (t, g, l, f) => {},
  // eslint-disable-next-line
  applyOrder: (g, l, f) => {},
};
