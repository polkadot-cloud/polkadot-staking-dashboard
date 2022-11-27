// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyFunction, AnyJson } from 'types';
import { FilterType } from './types';

export const defaultFiltersInterface = {
  // eslint-disable-next-line
  getFilters: (t: FilterType, g: string) => [],
  // eslint-disable-next-line
  toggleFilter: (t: FilterType, g: string, f: string) => {},
  // eslint-disable-next-line
  setMultiFilters: (t: FilterType, g: string, fs: Array<string>) => {},
  // eslint-disable-next-line
  getOrder: (g: string) => 'default',
  // eslint-disable-next-line
  setOrder: (g: string, o: string) => {},
  // eslint-disable-next-line
  getSearchTerm: (g: string) => null,
  // eslint-disable-next-line
  setSearchTerm: (g: string, t: string) => {},
  // eslint-disable-next-line
  resetFilters: (t: FilterType, g: string) => {},
  // eslint-disable-next-line
  resetOrder: (g: string) => {},
  // eslint-disable-next-line
  clearSearchTerm: (g: string) => {},
  // eslint-disable-next-line
  applyFilters: (
    t: FilterType,
    g: string,
    list: AnyJson,
    fn: AnyFunction
  ) => {},
  // eslint-disable-next-line
  applyOrder: (g: string, list: AnyJson, fn: AnyFunction) => {},
};
