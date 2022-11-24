// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyFunction, AnyJson } from 'types';

export enum FilterType {
  Exclude,
  Include,
}

export interface FiltersContextInterface {
  getFilters: (t: FilterType, g: string) => Array<string> | null;
  toggleFilter: (t: FilterType, g: string, f: string) => void;
  setMultiFilters: (t: FilterType, g: string, fs: Array<string>) => void;
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

export type FilterItems = Array<FilterItem>;
export type FilterItem = { key: string; filters: Array<string> };

export type FilterOrders = Array<FilterOrder>;
export type FilterOrder = { key: string; order: string };

export type FilterSearches = Array<FilterSearch>;
export type FilterSearch = { key: string; searchTerm: string };
