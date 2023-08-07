// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction, AnyJson } from 'types';

export type FilterType = 'exclude' | 'include';

export interface FiltersContextInterface {
  getFilters: (t: FilterType, g: string) => string[] | null;
  toggleFilter: (t: FilterType, g: string, f: string) => void;
  setMultiFilters: (t: FilterType, g: string, fs: string[], r: boolean) => void;
  getOrder: (g: string) => string;
  setOrder: (g: string, o: string) => void;
  getSearchTerm: (g: string) => string | null;
  setSearchTerm: (g: string, t: string) => void;
  resetFilters: (t: FilterType, g: string) => void;
  resetOrder: (g: string) => void;
  clearSearchTerm: (g: string) => void;
  applyFilters: (
    t: FilterType,
    g: string,
    list: AnyJson,
    fn: AnyFunction
  ) => void;
  applyOrder: (g: string, list: AnyJson, fn: AnyFunction) => void;
}

export type FilterItems = FilterItem[];
export type FilterItem = { key: string; filters: string[] };

export type FilterOrders = FilterOrder[];
export type FilterOrder = { key: string; order: string };

export type FilterSearches = FilterSearch[];
export type FilterSearch = { key: string; searchTerm: string };
