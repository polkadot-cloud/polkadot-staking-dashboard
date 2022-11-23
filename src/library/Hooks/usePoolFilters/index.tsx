// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors

import { AnyFunction, AnyJson } from 'types';

export const usePoolFilters = () => {
  const filtersToLabels: { [key: string]: string } = {
    inactive: 'Inactive Pools',
  };

  /*
   * filterInactive
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * not actively nominating.
   * Returns the updated filtered list.
   */
  const filterInactive = (list: any) => {
    return list;
  };

  const filterToFunction: { [key: string]: AnyFunction } = {
    inactive: filterInactive,
  };

  const getFiltersToApply = (excludes: Array<string>) => {
    const fns = [];
    for (const exclude of excludes) {
      if (filterToFunction[exclude]) {
        fns.push(filterToFunction[exclude]);
      }
    }
    return fns;
  };

  const applyFilter = (
    excludes: Array<string> | null,
    list: AnyJson,
    batchKey: string
  ) => {
    if (!excludes) {
      return list;
    }
    for (const fn of getFiltersToApply(excludes)) {
      list = fn(list, batchKey);
    }
    return list;
  };

  return {
    filterToFunction,
    filtersToLabels,
    applyFilter,
  };
};
