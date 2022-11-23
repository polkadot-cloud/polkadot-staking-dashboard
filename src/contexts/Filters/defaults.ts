// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyFunction, AnyJson } from 'types';

export const defaultFiltersInterface = {
  // eslint-disable-next-line
  getExcludes: (g: string) => [],
  // eslint-disable-next-line
  toggleExclude: (g: string, f: string) => { },
  // eslint-disable-next-line
  setMultiExcludes: (g: string, fs: Array<string>) => { },
  // eslint-disable-next-line
  getOrder: (g: string) => 'default',
  // eslint-disable-next-line
  setOrder: (g: string, o: string) => { },
  // eslint-disable-next-line
  getSearchTerm: (g: string) => null,
  // eslint-disable-next-line
  setSearchTerm: (g: string, t: string) => { },
  // eslint-disable-next-line
  clearExcludes: (g: string) => { },
  // eslint-disable-next-line
  clearOrder: (g: string) => { },
  // eslint-disable-next-line
  clearSearchTerm: (g: string) => { },
  // eslint-disable-next-line
  applyExcludes: (g: string, list: AnyJson, fn: AnyFunction) => { },
  // eslint-disable-next-line
  applyOrder: (g: string, list: AnyJson, fn: AnyFunction) => { }
};
