// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors

import { AnyFunction, AnyJson } from 'types';

export const usePoolFilters = () => {
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

  /*
   * filterLocked
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * locked.
   * Returns the updated filtered list.
   */
  const filterLocked = (list: any) => {
    return list;
  };

  /*
   * filterDestroying
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * being destroyed.
   * Returns the updated filtered list.
   */
  const filterDestroying = (list: any) => {
    return list;
  };

  const filtersToLabels: { [key: string]: string } = {
    inactive: 'Inactive Pools',
    locked: 'Locked Pools',
    dstroying: 'Destroying Pools',
  };

  const filterToFunction: { [key: string]: AnyFunction } = {
    inactive: filterInactive,
    locked: filterLocked,
    destroying: filterDestroying,
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
