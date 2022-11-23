// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors

import { useBondedPools } from 'contexts/Pools/BondedPools';
import { BondedPool } from 'contexts/Pools/types';
import { useStaking } from 'contexts/Staking';
import { AnyFunction, AnyJson } from 'types';

export const usePoolFilters = ({ batchKey }: { batchKey: string }) => {
  const { meta } = useBondedPools();
  const { getNominationsStatusFromTargets } = useStaking();
  // get pool targets from nominations meta batch
  const nominations = meta[batchKey]?.nominations ?? [];

  /*
   * filterInactive
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * not actively nominating.
   * Returns the updated filtered list.
   */
  const filterInactive = (list: any) => {
    let i = 0;
    const filteredList = list.filter((p: BondedPool) => {
      const targets = nominations[i]?.targets ?? [];
      // targets have not yet synced
      if (!targets.length) {
        return list;
      }
      const status = getNominationsStatusFromTargets(
        p.addresses.stash,
        targets
      );
      i++;
      return status === 'active';
    });
    return filteredList;
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

  const applyFilter = (excludes: Array<string> | null, list: AnyJson) => {
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
