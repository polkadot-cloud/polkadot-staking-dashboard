// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyFunction, AnyJson } from 'types';

export interface FiltersContextInterface {
  getExcludes: (g: string) => Array<string> | null;
  toggleExclude: (g: string, f: string) => void;
  setMultiExcludes: (g: string, fs: Array<string>) => void;
  getOrder: (g: string) => string | null;
  setOrder: (g: string, o: string) => void;
  getSearchTerm: (g: string) => string | null;
  setSearchTerm: (g: string, t: string) => void;
  clearExcludes: (g: string) => void;
  clearOrder: (g: string) => void;
  clearSearchTerm: (g: string) => void;
  applyExcludes: (g: string, list: AnyJson, fn: AnyFunction) => void;
  applyOrder: (g: string, list: AnyJson, fn: AnyFunction) => void;
}

export type FilterExcludes = Array<FilterExclude>;
export type FilterExclude = { key: string; filters: Array<string> };

export type FilterOrders = Array<FilterOrder>;
export type FilterOrder = { key: string; order: string };

export type FilterSearches = Array<FilterSearch>;
export type FilterSearch = { key: string; searchTerm: string };
